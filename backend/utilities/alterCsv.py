import pandas as pd 
import sys

def data_translation(raw_string):
    data = pd.read_csv('./data_translation.csv')

    data.drop('english', inplace=True, axis=1)

    mask = data[data['original'].str.contains(raw_string)]

    print(mask['apple'].item())

if __name__ == "__main__":
    string = sys.argv[1]
    data_translation(string)

