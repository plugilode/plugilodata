import pandas as pd
import datetime

# Read the input CSV file
input_file = 'input.csv'
data = pd.read_csv(input_file)

# Remove occurrences of "{'XXXX':" from all string entries
data = data.applymap(lambda x: x.replace("{'XXXX':", "") if isinstance(x, str) else x)

# Generate output file name with timestamp
timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
output_file = f"{timestamp}_out.csv"

# Save the modified DataFrame to a new CSV file
data.to_csv(output_file, index=False)
