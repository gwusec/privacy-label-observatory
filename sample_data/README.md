Note that you must have `uv` installed to export/import sample data. (See [uv](https://docs.astral.sh/uv/getting-started/installation/).)

# Exporting Run Data
Sample data can be exported from Elasticsearch to a local directory. This is useful for local testing and development purposes. By default, sample data will include up to 500 apps across a random 10 of the most recent 20 runs.

To export data from Elasticsearch, you can run the following command from the `sample_data` directory:

```console
$ uv run export.py
```

This will export the run data from Elasticsearch into a folder named `export`, creating a JSON file for each run index.

Note that this must be done from the Elasticsearch instance where **all** of the data is stored, otherwise it will just export sample data.

## Updating the sample data
To update the sample data included in this repo, simply run the export command above, then tar the `export` directory as follows (from the `sample_data` directory):

```console
$ tar -cvf data.tar export
```

# Importing Sample Data
This sample data can be imported into Elasticsearch to create the necessary indices and documents for testing and development.

To import the sample data, you can run the following command from the `sample_data` directory:

```console
$ uv run import.py
```

You must also have Elasticsearch running and accessible, with the correct credentials set in the environment variables `ELASTIC_USERNAME` and `ELASTIC_PASSWORD`. See the [backend README](../backend/README.md) for more details on setting up Elasticsearch and Kibana.