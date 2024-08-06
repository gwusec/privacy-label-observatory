from elasticsearch import Elasticsearch, helpers

# Initialize the Elasticsearch client
es = Elasticsearch("http://localhost:9200", basic_auth=["elastic", "BGx=DB-POME9uzH*=8qY"])

# Function to get all indexes matching a pattern
def get_indexes(es, pattern):
    return [index for index in es.indices.get(index='*') if pattern in index]

# Function to reindex (rename) an index
def reindex(es, old_index):
    # if i < 10:
    #     es.indices.delete(index=f"newrun_0000{old_index}")
    # else:
    #     es.indices.delete(index=f"newrun_000{old_index}")
    es.indices.delete(index=old_index)



# # Define the pattern to match indexes you want to rename
# pattern = "run"
# new_prefix = "run_000"
# index_counter = 1

# # Get all indexes matching the pattern
# indexes_to_rename = get_indexes(es, pattern)

# # Loop through each index and rename it
# for old_index in indexes_to_rename:
#     reindex(es, old_index)

# for i in range (1, 70):
#     reindex(es, i)
reindex(es, "run_00070")