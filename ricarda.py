import requests
import json
import sys
import csv
import os
from datetime import datetime
from typing import Optional, Dict, List, Any
from bs4 import BeautifulSoup

class AIDBClient:
    """Client for interacting with the AI Database web interface."""

    def __init__(self, base_url: str = "http://51.12.241.183") -> None:
        """Initialize the client with the base URL."""
        self.base_url = base_url.rstrip('/')
        self.headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'User-Agent': 'Python/Requests'
        }
        # Create output directory if it doesn't exist
        self.output_dir = "ai_database_exports"
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Create single CSV file with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.csv_file = os.path.join(self.output_dir, f"ai_database_export_{timestamp}.csv")
        self.csv_headers = [
            # Basic Info
            'domain',
            'version',
            'name',
            'firstCompanyName',
            'category',
            
            # Contact Info
            'street',
            'city',
            'zip',
            'phone',
            'email',
            
            # Website Info
            'website_title',
            'website_url',
            'website_description',
            
            # Website Images
            'website_images',
            
            # Metadata
            'created',
            'utc_time_create',
            'person',
            
            # Additional Website Info
            'og_title',
            'og_description',
            'og_image',
            'og_site_name',
            'og_url',
            
            # Raw Data
            'raw_details'  # Store the complete JSON for reference
        ]
        
        # Initialize CSV file with headers
        with open(self.csv_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(self.csv_headers)

    def save_to_csv(self, data: List[Dict[str, Any]], page: int) -> None:
        """Save the data to CSV file.
        
        Args:
            data: List of company data dictionaries
            page: Current page number (for logging only)
        """
        rows = []
        for item in data:
            website_info = item.get('websiteInfo', {})
            meta_info = website_info.get('meta', {})
            og_info = website_info.get('og', {})
            images = website_info.get('images', [])
            
            # Format images list as string
            images_str = ';'.join([img.get('src', '') for img in images]) if images else ''
            
            row = [
                # Basic Info
                item.get('domain', ''),
                item.get('version', ''),
                item.get('name', ''),
                item.get('firstCompanyName', ''),
                item.get('category', ''),
                
                # Contact Info
                item.get('contact', {}).get('street', ''),
                item.get('contact', {}).get('city', ''),
                item.get('contact', {}).get('zip', ''),
                item.get('contact', {}).get('phone', ''),
                item.get('contact', {}).get('email', ''),
                
                # Website Info
                meta_info.get('title', ''),
                meta_info.get('url', ''),
                meta_info.get('description', ''),
                
                # Website Images
                images_str,
                
                # Metadata
                item.get('created', ''),
                item.get('utc_time_create', ''),
                item.get('person', ''),
                
                # OpenGraph Info
                og_info.get('title', ''),
                og_info.get('description', ''),
                og_info.get('image', ''),
                og_info.get('site_name', ''),
                og_info.get('url', ''),
                
                # Raw Data
                json.dumps(item)  # Store complete JSON for reference
            ]
            rows.append(row)
        
        # Append to CSV file
        with open(self.csv_file, 'a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerows(rows)
        
        print(f"Saved {len(rows)} entries from page {page} to {self.csv_file}")

    def get_data(self) -> Optional[List[Dict[str, Any]]]:
        """Get data from the main page and parse the embedded JSON.
        
        Returns:
            List of dictionaries containing the parsed data, or None if failed
        """
        try:
            all_results = []
            page = 1
            
            while True:
                print(f"\nFetching page {page}...")
                response = requests.get(
                    self.base_url, 
                    params={'page': page}, 
                    headers=self.headers, 
                    verify=False
                )
                
                if not response.ok:
                    print(f"Error: {response.status_code} - {response.text}")
                    break
                
                soup = BeautifulSoup(response.text, 'html.parser')
                table = soup.find('table')
                
                if not table:
                    print("No table found in the HTML")
                    break
                
                # Get column indices from headers
                headers = table.find_all('th')
                header_texts = [h.text.strip().lower() for h in headers]
                domain_idx = header_texts.index('domain')
                details_idx = header_texts.index('details')
                version_idx = header_texts.index('current version')
                
                # Get all rows except header
                rows = table.find_all('tr')[1:]  # Skip header row
                if not rows:  # If no rows found, we've reached the end
                    break
                    
                print(f"Found {len(rows)} rows on page {page}")
                
                page_results = []
                for row in rows:
                    try:
                        cells = row.find_all('td')
                        if len(cells) <= max(domain_idx, details_idx, version_idx):
                            continue
                            
                        domain = cells[domain_idx].text.strip()
                        details = cells[details_idx].text.strip()
                        version = cells[version_idx].text.strip()
                        
                        # Extract JSON from details
                        if 'show' in details:
                            json_text = details.split('show')[1].split('close')[0].strip()
                            try:
                                data = json.loads(json_text)
                                page_results.append({
                                    'domain': domain,
                                    'version': version,
                                    'name': data.get('name', ''),
                                    'category': data.get('category', ''),
                                    'contact': {
                                        'street': data.get('street', ''),
                                        'city': data.get('city', ''),
                                        'zip': data.get('zip', ''),
                                        'phone': data.get('phone', ''),
                                        'email': data.get('email', '')
                                    },
                                    'websiteInfo': data.get('websiteInfo', {}),
                                    'created': data.get('utc_time_create', '')
                                })
                            except json.JSONDecodeError as e:
                                print(f"Failed to parse JSON for {domain}: {e}")
                                continue
                    except Exception as e:
                        print(f"Error processing row: {e}")
                        continue
                
                if page_results:
                    # Save this page's results to CSV
                    self.save_to_csv(page_results, page)
                    
                    all_results.extend(page_results)
                    print(f"Total companies found so far: {len(all_results)}")
                    page += 1
                else:
                    break  # No more results found
                
            print(f"\nFinished fetching all pages")
            print(f"Total companies found: {len(all_results)}")
            print(f"Full export saved to: {self.csv_file}")
            return all_results
                
        except requests.exceptions.RequestException as e:
            print(f"Request error: {e}")
            return None
        except Exception as e:
            print(f"Unexpected error: {e}")
            return None

    def search_data(self, search_term: str) -> Optional[List[Dict[str, Any]]]:
        """Search through the data using a search term.
        
        Args:
            search_term: The term to search for in the data
            
        Returns:
            List of matching entries, or None if the search failed
        """
        data = self.get_data()
        if not data:
            return None
            
        search_term = search_term.lower()
        matches = [
            item for item in data 
            if search_term in json.dumps(item).lower()
        ]
        print(f"Found {len(matches)} matches for term '{search_term}'")
        return matches

    def get_database_stats(self) -> Dict[str, Any]:
        """Get statistics about the database.
        
        Returns:
            Dictionary containing database statistics
        """
        data = self.get_data()
        if not data:
            return {}
            
        stats = {
            'total_entries': len(data),
            'categories': {},
            'cities': {},
            'domains_by_tld': {},
            'versions': {}
        }
        
        for entry in data:
            # Count by category
            category = entry.get('category', 'Unknown')
            stats['categories'][category] = stats['categories'].get(category, 0) + 1
            
            # Count by city
            city = entry.get('contact', {}).get('city', 'Unknown')
            stats['cities'][city] = stats['cities'].get(city, 0) + 1
            
            # Count by domain TLD
            domain = entry.get('domain', '')
            tld = domain.split('.')[-1].rstrip('/') if domain else 'Unknown'
            stats['domains_by_tld'][tld] = stats['domains_by_tld'].get(tld, 0) + 1
            
            # Count by version
            version = entry.get('version', 'Unknown')
            stats['versions'][version] = stats['versions'].get(version, 0) + 1
        
        return stats


def main() -> None:
    """Main function to demonstrate the usage of AIDBClient."""
    client = AIDBClient()
    
    # Get database statistics
    print("\nGetting database statistics...")
    stats = client.get_database_stats()
    
    if stats:
        print(f"\nTotal Companies in Database: {stats['total_entries']}")
        
        # Optional: Show breakdown by category
        print("\nBreakdown by Category:")
        for category, count in stats['categories'].items():
            print(f"- {category}: {count}")


if __name__ == "__main__":
    main()