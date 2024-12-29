import json
import pandas as pd
from ast import literal_eval
import os
import csv

def validate_file_path(file_path, check_exists=True):
    """Validate if the file path is valid and exists if required"""
    if not file_path.endswith('.csv'):
        raise ValueError("File must be a CSV file")
    if check_exists and not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    return True

def detect_delimiter(file_path):
    """Detect the delimiter used in the CSV file"""
    with open(file_path, 'r', encoding='utf-8') as file:
        first_line = file.readline()
        sniffer = csv.Sniffer()
        dialect = sniffer.sniff(first_line)
        return dialect.delimiter

def clean_value(value):
    """Clean and format individual values"""
    if pd.isna(value):
        return ""
    
    value = str(value).strip()
    
    # Remove extra quotes
    if value.startswith('"') and value.endswith('"'):
        value = value[1:-1]
    
    # Handle escaped quotes
    value = value.replace('""', '"')
    
    return value

def format_company_data(input_file, output_file):
    """Format company data from input CSV to a flattened structure"""
    try:
        # Validate input file
        validate_file_path(input_file)
        validate_file_path(output_file, check_exists=False)
        
        print(f"Reading data from {input_file}...")
        
        # Detect delimiter
        delimiter = detect_delimiter(input_file)
        print(f"Detected delimiter: '{delimiter}'")
        
        # Read the file with detected delimiter
        try:
            df = pd.read_csv(input_file, 
                           delimiter=delimiter,
                           dtype=str,
                           encoding='utf-8',
                           quoting=csv.QUOTE_ALL,
                           na_filter=False)
        except UnicodeDecodeError:
            # Try different encoding if UTF-8 fails
            df = pd.read_csv(input_file,
                           delimiter=delimiter,
                           dtype=str,
                           encoding='latin1',
                           quoting=csv.QUOTE_ALL,
                           na_filter=False)
        
        if df.empty:
            print("Warning: The input CSV file is empty")
            return False
        
        # Clean column names
        df.columns = [col.strip().replace('"', '') for col in df.columns]
        
        # Process each column
        for column in df.columns:
            try:
                # Clean values
                df[column] = df[column].apply(clean_value)
                
                # Try to parse JSON-like strings
                if df[column].str.contains('{').any() or df[column].str.contains('[').any():
                    df[column] = df[column].apply(lambda x: safe_process_value(x))
                    
            except Exception as e:
                print(f"Warning: Error processing column '{column}': {str(e)}")
                continue
        
        # Save to CSV with proper formatting
        df.to_csv(output_file, 
                 index=False,
                 quoting=csv.QUOTE_MINIMAL,
                 encoding='utf-8',
                 escapechar='\\',
                 doublequote=True)
        
        print(f"Data has been successfully formatted and saved to {output_file}")
        return True
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

def safe_process_value(value):
    """Safely process a value, returning original value if processing fails"""
    try:
        if not isinstance(value, str):
            return value
            
        value = value.strip()
        if value.startswith('{') and value.endswith('}'):
            parsed = literal_eval(value)
            return json.dumps(parsed)
        elif value.startswith('[') and value.endswith(']'):
            parsed = literal_eval(value)
            return json.dumps(parsed)
        return value
    except:
        return value

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
    print("CSV Format Utility")
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