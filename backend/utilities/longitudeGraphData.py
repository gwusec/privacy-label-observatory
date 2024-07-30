from elasticsearch import Elasticsearch

username = "elastic"
password = "BGx=DB-POME9uzH*=8qY"

# Initialize the Elasticsearch client
es = Elasticsearch("http://localhost:9200", http_auth=(username, password), verify_certs=False)

# List of indices
indices = ["run_0001", "run_0002", "run_0003", ...]  # Add all your indices here

# Query templates
queries = {
    "total_apps": {"query": {"match_all": {}}},
    "privacy_data_apps": {"query": {"exists": {"field": "privacylabels.privacyDetails"}}},
    "data_not_collected": {"query": {"term": {"privacylabels.privacyDetails.privacyTypes.keyword": {"value": "Data Not Collected"}}}},
    "data_not_linked": {"query": {"term": {"privacylabels.privacyDetails.privacyTypes.keyword": {"value": "Data Not Linked to You"}}}},
    "data_linked": {"query": {"term": {"privacylabels.privacyDetails.privacyTypes.keyword": {"value": "Data Linked to You"}}}},
    "data_used_to_track": {"query": {"term": {"privacylabels.privacyDetails.privacyTypes.keyword": {"value": "Data Used to Track You"}}}}
}

# Store results
results = {}

# Run queries for each index
for index in range(1, 70):
    if index < 10:
        results[f'run_0000{index}'] = {}
        for query_name, query_body in queries.items():
            response = es.count(index=f'run_0000{index}', body=query_body)
            results[index][query_name] = response['count']
    else:
        results[f'run_000{index}'] = {}
        for query_name, query_body in queries.items():
            response = es.count(index=f'run_000{index}', body=query_body)
            results[index][query_name] = response['count']

# Print results
for index, counts in results.items():
    print(f"Index: {index}")
    for query_name, count in counts.items():
        print(f"  {query_name}: {count}")
