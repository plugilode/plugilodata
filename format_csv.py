import json
import pandas as pd
from ast import literal_eval
import os

def validate_file_path(file_path, check_exists=True):
    """Validate if the file path is valid and exists if required"""
    if not file_path.endswith('.csv'):
        raise ValueError("File must be a CSV file")
    if check_exists and not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    return True

def safe_process_value(value):
    """Safely process a value, returning original value if processing fails"""
    try:
        # Try to evaluate strings that look like lists or dicts
        if isinstance(value, str):
            if value.startswith('[') and value.endswith(']'):
                return literal_eval(value)
            elif value.startswith('{') and value.endswith('}'):
                return literal_eval(value)
        return value
    except:
        return value

def format_company_data(input_file, output_file):
    """Format company data from input CSV to a flattened structure"""
    try:
        # Validate input file
        validate_file_path(input_file)
        
        # Validate output file path
        validate_file_path(output_file, check_exists=False)
        
        print(f"Reading data from {input_file}...")
        
        # Read the CSV file with all columns as strings
        df = pd.read_csv(input_file, dtype=str)
        
        if df.empty:
            print("Warning: The input CSV file is empty")
            return False
        
        # Process each column
        for column in df.columns:
            try:
                # Safely process each value in the column
                df[column] = df[column].apply(safe_process_value)
            except Exception as e:
                print(f"Warning: Error processing column '{column}': {str(e)}")
                continue
        
        # Save to CSV
        df.to_csv(output_file, index=False)
        print(f"Data has been successfully formatted and saved to {output_file}")
        return True
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

def get_user_input():
    """Get input and output file paths from user"""
    while True:
        try:
            # Get input file path
            input_file = input("Please enter the path to your input CSV file: ").strip()
            validate_file_path(input_file)
            
            # Get output file path
            output_file = input("Please enter the desired output CSV file path: ").strip()
            
            # If output file exists, ask for confirmation to overwrite
            if os.path.exists(output_file):
                confirm = input(f"'{output_file}' already exists. Do you want to overwrite it? (y/n): ").lower()
                if confirm != 'y':
                    continue
            
            return input_file, output_file
            
        except (ValueError, FileNotFoundError) as e:
            print(f"Error: {str(e)}")
            retry = input("Would you like to try again? (y/n): ").lower()
            if retry != 'y':
                return None, None

if __name__ == "__main__":
    print("Company Data Format Utility")
    print("-" * 30)
    
    # Get file paths from user
    input_file, output_file = get_user_input()
    
    if input_file and output_file:
        # Process the files
        if format_company_data(input_file, output_file):
            print("Processing completed successfully!")
        else:
            print("Processing completed with some warnings. Please check the messages above.")
    else:
        print("Operation cancelled by user.") 