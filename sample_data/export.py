import json
import os
import random

from dotenv import load_dotenv
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan

# Load environment variables from .env file
load_dotenv()

server_url = os.getenv("ELASTIC_ENDPOINT", "http://localhost:9200")
username = os.getenv("ELASTIC_USERNAME", "elastic")
password = os.getenv("ELASTIC_PASSWORD", "")

es = Elasticsearch([server_url], basic_auth=(username, password), verify_certs=False, ssl_show_warn=False)

# Get all `run_*` indices
selected_indices = random.sample(
    sorted([index for index in es.indices.get_alias(index="run_*")])[:20], 10
)


def get_unique_app_ids(inde, limit=None):
    """Get unique app_ids from a given index, optionally limiting the number and stopping early."""
    app_ids = set()
    after_key = None

    while True:
        if limit and len(app_ids) >= limit:
            break

        aggs = {
            "app_ids": {
                "composite": {
                    "size": 1000,
                    "sources": [{"app_id": {"terms": {"field": "app_id.keyword"}}}],
                }
            }
        }
        if after_key:
            aggs["app_ids"]["composite"]["after"] = after_key

        res = es.search(index=index, aggs=aggs, size=0)
        buckets = res["aggregations"]["app_ids"]["buckets"]
        for bucket in buckets:
            app_ids.add(bucket["key"]["app_id"])
            if limit and len(app_ids) >= limit:
                break

        after_key = res["aggregations"]["app_ids"].get("after_key")
        if not after_key:
            break

    return app_ids


# Get intersection of all app_ids across selected indices
common_app_ids = set()
target_size = 1000  # Setting this higher to account for potential intersection losses
for i, index in enumerate(selected_indices):
    # For first index, get more IDs. For subsequent indices, limit based on current intersection size
    if i == 0:
        ids = get_unique_app_ids(index, limit=target_size)
    else:
        # Estimate how many we need based on current intersection size
        estimated_needed = min(target_size, len(common_app_ids) * 2)
        ids = get_unique_app_ids(index, limit=estimated_needed)

    # Update the intersection
    if len(common_app_ids) == 0:
        common_app_ids = ids
    else:
        common_app_ids.intersection_update(ids)

    if len(common_app_ids) < 500:
        print(
            f"Early exit: {len(common_app_ids)} common app_ids found after index {i + 1} ({index})"
        )
        break  # early exit if no overlap

# Truncate to ~500 app_ids
final_app_ids = random.sample((list(common_app_ids)), min(500, len(common_app_ids)))


def export_documents_by_index(app_ids, indices, output_dir="export"):
    os.makedirs(output_dir, exist_ok=True)

    for index in indices:
        output_file = os.path.join(output_dir, f"{index}.jsonl")
        with open(output_file, "w") as f:
            count = 0
            for app_id in app_ids:
                query = {"query": {"term": {"app_id": app_id}}}

                for doc in scan(es, index=index, query=query, preserve_order=False):
                    # Optionally tag the doc with its source index
                    doc["_source"]["_index"] = index
                    doc["_source"]["_app_id"] = app_id
                    json.dump(doc["_source"], f)
                    f.write("\n")
                    count += 1

        print(f"[{index}] Exported {count} documents to {output_file}")


# Export documents for the final set of app_ids across selected indices
export_documents_by_index(final_app_ids, selected_indices)
