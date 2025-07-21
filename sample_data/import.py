import json
import os
import tarfile

import urllib3
from dotenv import load_dotenv
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Load environment variables from .env file
load_dotenv()


class ExportedDataImporter:
    def __init__(self, server_url, username, password):
        self.es = Elasticsearch([server_url], basic_auth=(username, password), verify_certs=False)

    def create_index_if_not_exists(self, index_name):
        """Create index if it doesn't exist with comprehensive mapping for the exported data structure."""
        # Delete index if it exists to overwrite
        if self.es.indices.exists(index=index_name):
            print(f"Deleting existing index: {index_name}")
            self.es.indices.delete(index=index_name)

        # Comprehensive mapping based on apple_elastic.py structure
        mapping = {
            "properties": {
                "app_id": {"type": "keyword"},
                "type": {"type": "keyword"},
                "href": {"type": "keyword"},
                "app_version": {"type": "keyword"},
                "app_name": {"type": "keyword"},
                "app_url": {"type": "keyword"},
                "country_code": {"type": "keyword"},
                "@timestamp": {"type": "date"},
                "timestamp": {"type": "date"},
                "metadata": {
                    "properties": {
                        "user_rating_value": {"type": "float"},
                        "user_rating_count": {"type": "number"},
                        "user_rating_label": {"type": "keyword"},
                        "artist_name": {"type": "keyword"},
                        "web_url": {"type": "keyword"},
                        "app_store_position": {"type": "number"},
                        "app_store_genre_name": {"type": "keyword"},
                        "app_store_genre_code": {"type": "number"},
                        "app_store_chart": {"type": "keyword"},
                        "content_rating": {"type": "keyword"},
                        "distribution_kind": {"type": "keyword"},
                        "version_release_date": {"type": "keyword"},
                        "release_date": {"type": "keyword"},
                        "privacy_policy_url": {"type": "keyword"},
                        "has_in_app_purchases": {"type": "number"},
                        "seller": {"type": "keyword"},
                        "price_formatted": {"type": "keyword"},
                        "price": {"type": "float"},
                        "currency_code": {"type": "keyword"},
                        "app_flavor": {"type": "keyword"},
                        "app_size": {"type": "number"},
                    }
                },
                "privacylabels": {
                    "properties": {
                        "privacyDetails": {
                            "type": "nested",
                            "properties": {
                                "privacyTypes": {"type": "keyword"},
                                "identifier": {"type": "keyword"},
                                "purposes": {
                                    "type": "nested",
                                    "properties": {
                                        "identifier": {"type": "keyword"},
                                        "purpose": {"type": "keyword"},
                                        "dataCategories": {
                                            "type": "nested",
                                            "properties": {
                                                "dataCategory": {"type": "keyword"},
                                                "dataTypes": {
                                                    "type": "nested",
                                                    "properties": {
                                                        "data_category": {"type": "number"},
                                                        "data_type": {"type": "keyword"},
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                                "dataCategories": {
                                    "type": "nested",
                                    "properties": {
                                        "dataCategory": {"type": "keyword"},
                                        "dataTypes": {
                                            "type": "nested",
                                            "properties": {
                                                "data_category": {"type": "number"},
                                                "data_type": {"type": "keyword"},
                                            },
                                        },
                                    },
                                },
                            },
                        }
                    }
                },
            }
        }

        try:
            self.es.indices.create(index=index_name, mappings=mapping)
            print(f"Created index: {index_name}")
        except Exception as e:
            print(f"Error creating index {index_name}: {e}")

    def import_jsonl_file(self, file_path, target_index=None):
        """Import a JSONL file into Elasticsearch."""
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            return

        # If no target index specified, derive from filename
        if target_index is None:
            filename = os.path.basename(file_path)
            target_index = filename.replace(".jsonl", "")

        # Create index if it doesn't exist
        self.create_index_if_not_exists(target_index)

        documents = []
        doc_count = 0

        print(f"Reading documents from {file_path}...")

        with open(file_path, "r") as f:
            for line_num, line in enumerate(f, 1):
                try:
                    doc = json.loads(line.strip())

                    # Prepare document for bulk indexing
                    es_doc = {"_index": target_index, "_source": doc}

                    # Use app_id as document ID if available
                    if "app_id" in doc:
                        es_doc["_id"] = doc["app_id"]

                    documents.append(es_doc)
                    doc_count += 1

                    # Bulk index every 1000 documents
                    if len(documents) >= 1000:
                        self._bulk_index(documents, target_index)
                        documents = []

                except json.JSONDecodeError as e:
                    print(f"Error parsing JSON on line {line_num}: {e}")
                except Exception as e:
                    print(f"Error processing line {line_num}: {e}")

        # Index remaining documents
        if documents:
            self._bulk_index(documents, target_index)

        print(f"Successfully imported {doc_count} documents to index {target_index}")

    def _bulk_index(self, documents, index_name):
        """Perform bulk indexing with error handling."""
        try:
            # Use the newer options() method instead of passing parameters directly
            es_client = self.es.options(request_timeout=60)
            success, failed = bulk(
                es_client,
                documents,
                index=index_name,
                refresh=True,
                chunk_size=500,  # Reduce chunk size
                max_retries=3,
                initial_backoff=2,
                max_backoff=600,
            )
            if failed:
                print(f"Failed to index {len(failed)} documents in {index_name}")
                # Print first few failures for debugging
                for i, error in enumerate(failed[:3]):
                    print(f"Error {i + 1}: {error}")
        except Exception as e:
            print(f"Bulk indexing error for {index_name}: {e}")
            # Print more detailed error information
            if hasattr(e, "errors"):
                for error in e.errors[:3]:  # Show first 3 errors
                    print(f"Detailed error: {error}")

    def import_export_directory(self, export_dir="export"):
        """Import all JSONL files from the export directory."""
        if not os.path.exists(export_dir):
            print(f"Export directory not found: {export_dir}")
            return

        jsonl_files = [f for f in os.listdir(export_dir) if f.endswith(".jsonl")]

        if not jsonl_files:
            print(f"No JSONL files found in {export_dir}")
            return

        print(f"Found {len(jsonl_files)} JSONL files to import")

        for filename in sorted(jsonl_files):
            file_path = os.path.join(export_dir, filename)
            # Use original index name without prefix
            target_index = filename.replace(".jsonl", "")

            print(f"\nImporting {filename} to index {target_index}...")
            self.import_jsonl_file(file_path, target_index)

    def get_index_stats(self, index_pattern="run_*"):
        """Get statistics for imported indices."""
        try:
            indices = self.es.indices.get(index=index_pattern)
            for index_name in indices:
                count = self.es.count(index=index_name)["count"]
                print(f"Index {index_name}: {count} documents")
        except Exception as e:
            print(f"Error getting index stats: {e}")


def main():
    # Configuration
    server_url = os.getenv("ELASTIC_ENDPOINT", "http://localhost:9200")
    username = os.getenv("ELASTIC_USERNAME", "elastic")
    password = os.getenv("ELASTIC_PASSWORD", "")

    if not password:
        print("Warning: No Elasticsearch password provided")

    # Initialize importer
    importer = ExportedDataImporter(server_url, username, password)

    # Extract exports from data.tar
    tar_path = "data.tar"
    if os.path.exists(tar_path):
        print(f"Extracting {tar_path}...")
        with tarfile.open(tar_path, "r") as tar:
            tar.extractall()
        print("Extraction completed.")
    else:
        print(f"Tar file not found: {tar_path}")
        return

    # Import all files from export directory
    print("Starting import process...")
    importer.import_export_directory(export_dir="export")

    # Show statistics
    print("\nImport completed. Index statistics:")
    importer.get_index_stats("run_*")

    # Run the initialize/update.sh script
    update_script_path = os.path.join(os.path.dirname(__file__), "initialize")
    if os.path.exists(update_script_path):
        print(f"\nRunning update script: {update_script_path}")
        os.system(f"cd {update_script_path} && ./update.sh")
    else:
        print(f"Update script not found: {update_script_path}")


if __name__ == "__main__":
    main()
