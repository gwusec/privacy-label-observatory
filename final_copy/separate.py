import json
import os

# Define the input file and output folder
input_file = './run69.json'
output_folder = './../run69'

# Ensure the output folder exists
os.makedirs(output_folder, exist_ok=True)

# Read the input file line by line
with open(input_file, 'r', encoding='utf-8') as file:
    for line_number, line in enumerate(file, start=1):
        # Parse the JSON object
        try:
            json_object = json.loads(line.strip())
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON on line {line_number}: {e}")
            continue
        
        # Define the output file path
        output_file = os.path.join(output_folder, f'json_{line_number}.json')
        
        # Write the JSON object to the output file
        with open(output_file, 'w', encoding='utf-8') as output:
            json.dump(json_object, output, ensure_ascii=False, indent=4)
        
        print(f'Saved JSON object from line {line_number} to {output_file}')
