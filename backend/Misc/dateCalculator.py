from datetime import datetime, timedelta
import json

# Starting date from the given dataset
start_date = datetime(2021, 7, 23)
num_runs = 120  # Total runs

# Generate the list of runs with a 7-day interval
runs = [{"run_number": f"run_{i:05d}", "date": (start_date + timedelta(weeks=i-1)).strftime("%Y-%m-%d")} for i in range(1, num_runs + 1)]

# Output the generated data
print(json.dumps(runs, indent=4))
