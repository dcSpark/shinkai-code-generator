# GCS Directory Downloader

A utility script to search and download directories from Google Cloud Storage (GCS) based on pattern matching.

## Prerequisites

1. **Google Cloud SDK**: The script requires the Google Cloud SDK to be installed and configured.
   ```bash
   # Verify installation
   gcloud --version
   
   # If not installed, follow the instructions at:
   # https://cloud.google.com/sdk/docs/install
   ```

2. **Authentication**: Ensure you're authenticated with Google Cloud:
   ```bash
   gcloud auth login
   ```

3. **Permissions**: You need appropriate permissions to access the GCS bucket (`shinkai-prompt-cache`).

## Installation

1. Make the script executable:
   ```bash
   chmod +x download_logs.sh
   ```

## Usage

The script provides two main functionalities:
1. Search for directories containing a specific pattern
2. Download directories containing a specific pattern

### Command Structure

```bash
./download_logs.sh [-s|-d] <pattern>
```

Options:
- `-s`: Search mode - Lists all directories containing the pattern
- `-d`: Download mode - Downloads all directories containing the pattern

### Examples

1. Search for directories containing "test":
   ```bash
   ./download_logs.sh -s "test"
   ```

2. Download directories containing "experiment":
   ```bash
   ./download_logs.sh -d "experiment"
   ```

### Output

- Search results will be displayed in the terminal
- Downloaded files will be saved in the `downloaded_files` directory, maintaining the original folder structure
- The script will preserve the directory hierarchy from GCS in the local download

### Notes

- The script searches only within the `gs://shinkai-prompt-cache/.execution/` path
- Pattern matching is case-insensitive
- Downloads are performed recursively for entire directories
- If no matches are found, the script will exit with a message
- Progress and status messages are displayed during execution

## Error Handling

The script includes error handling for common scenarios:
- Missing or invalid arguments
- No matching directories found
- Download failures

## Support

For any issues or questions, please contact the development team. 