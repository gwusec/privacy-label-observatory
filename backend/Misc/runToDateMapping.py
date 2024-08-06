import json
import datetime

def datesToRuns(filename):
  data = []
  current_date = datetime.datetime(year=2021, month=7, day=16)  # Starting date
  
  for i in range(1, 70):
    obj = {}
    obj["run_number"] = f'run_000{i}' if i < 10 else f'run_000{i}'

    # Add seven days to the current date
    current_date += datetime.timedelta(days=7)
    obj["date"] = current_date.strftime("%Y-%m-%d")  # Format as YYYY-MM-DD

    data.append(obj)  # Add object to the data list

  # Write data to JSON file
  with open(filename, 'w') as jsonfile:
    json.dump(data, jsonfile, indent=4)  # Indent for readability

# Example usage
filename = "dates_and_runs.json"
datesToRuns(filename)
print(f"Data written to JSON file: {filename}")
