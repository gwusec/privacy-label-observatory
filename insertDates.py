from elasticsearch import Elasticsearch
import json
from collections import defaultdict
import argparse
import urllib3
import json
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class AppleElasticSearchHandler:
    def __init__(self, server_url, index_name, username, password):
        self.es = Elasticsearch([server_url], http_auth=(username, password), verify_certs=False)
        self.index_name = index_name
    
    def get_document_count(self):
        res = self.es.count(index=self.index_name)
        return res
    
    def create_index(self):
        apple_mapping = {
            "mappings": {
                "properties": {
                    "run_number": {"type: integer"},
                    "date": {"type: date"}
                }
            }
        }

        try:
            if not self.es.indices.exists(index=self.index_name):
                self.es.indices.create(index=self.index_name, body=apple_mapping)
                # self.es.indices.create(index=self.index_name)
        except Exception as e:
            print(e)

    def stream_and_update(self, filename):
    #"""Streams data from a JSON file and sends updates to Elasticsearch line by line."""
        with open(filename, 'r') as file:
            data = json.load(file)
            for item in data:
                try:
                    key = item['run_number']  # Assuming 'app_id' is the unique identifier for each app
                    self.es.update(index=self.index_name, id=key, body={"doc": item, "doc_as_upsert": True})
                    # print(f"Successfully updated document with id {key}")
                except Exception as e:
                    print(f"Failed to update document. Error: {e}")




def main():
  # parser = argparse.ArgumentParser()
  # parser.add_argument("apple_crawl")
  # args = parser.parse_args()
  # es = Elasticsearch(hosts=['https://localhost:9200'], basic_auth=('elastic', 'Z*xjGkzvhNlndz5YrO0y'), verify_certs=False)
  # delete_index(es, 'apple')
  # es_handler.create_index()
  server_url = "https://localhost:9200"  
  username = "elastic"
  password = "=cY1P-4cZVpa3aRM0Tu-"

  # Initialize the AppleElasticSearchHandler
  apple_elastic_handler = AppleElasticSearchHandler(server_url, 'runs_to_dates', username, password)

  # Create index with the specified mapping
  apple_elastic_handler.create_index()

  # Index Apple data (replace 'apple_data.json' with your actual file)

  apple_elastic_handler.stream_and_update('date_run_mapping.json')


if __name__ == "__main__":
  main()

