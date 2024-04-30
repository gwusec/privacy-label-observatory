#!/usr/bin/python3

import json
import mysql.connector
from decimal import Decimal
from datetime import datetime

class CustomEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, Decimal):
      return str(obj)
    elif isinstance(obj, datetime):
      return obj.isoformat()
    return super(CustomEncoder, self).default(obj)

def connect_to_db():
  # Connects to the MySQL database
  return mysql.connector.connect(
    host="localhost",
    user="privacylabels", 
    password="SuqYR9rTzaNlK0hb2Pm7", 
    database="privacylabeldb" 
  )

def pull_run_data(run_id):
  # Retrieves data for a specific run_id
  connection = connect_to_db()
  cursor = connection.cursor(dictionary=True)
  try:
    query = "SELECT * FROM app WHERE run_id = %s"
    cursor.execute(query, (run_id,))
    rows = cursor.fetchall()
    return rows
  except mysql.connector.Error as e:
    print(f"SQL error occurred: {e}")
  finally:
    cursor.close()
    connection.close()

def write_run_data_to_json(start_run, end_run):
  # Writes data for each run into a separate JSON file
  for run_id in range(start_run, end_run + 1):
    print (f"Starting run {run_id}")
    run_data = pull_run_data(run_id)
    print (f"Writing run {run_id}")
    if run_data: # Only proceed if data is found
      file_name = f"./runs/run_{run_id}.json"
      with open(file_name, "w") as file:
        json.dump(run_data, file, cls=CustomEncoder, indent=4)
      print(f"Finished writing data for run {run_id} to {file_name}")
    else:
      print(f"No data found for run {run_id}")

if __name__ == "__main__":
  start_run_id = 67
  end_run_id = 70
  write_run_data_to_json(start_run_id, end_run_id)