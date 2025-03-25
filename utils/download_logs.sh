#!/bin/bash

# Function to show usage
show_usage() {
    echo "Usage: $0 [-s|-d] <pattern>"
    echo "Options:"
    echo "  -s: Search directories containing the pattern"
    echo "  -d: Download directories containing the pattern"
    echo "Example: $0 -s 'my-pattern'"
    exit 1
}

# Check if enough arguments are provided
if [ $# -lt 2 ]; then
    show_usage
fi

# Parse options
while getopts "sd" opt; do
    case $opt in
        s) ACTION="search";;
        d) ACTION="download";;
        \?) show_usage;;
    esac
done

# Shift the options to get the pattern
shift $((OPTIND-1))
PATTERN=$1
BASE_GCS_PATH="gs://shinkai-prompt-cache/.execution/"
LOCAL_BASE_DIR="downloaded_files"

if [ -z "$PATTERN" ] || [ -z "$ACTION" ]; then
    show_usage
fi

echo "Searching for directories containing pattern: $PATTERN in $BASE_GCS_PATH"

# List all directories and filter with grep
all_dirs=$(gcloud storage ls $BASE_GCS_PATH | grep -i $PATTERN || true)

if [ -z "$all_dirs" ]; then
    echo "No directories found containing the pattern: $PATTERN"
    exit 1
fi

# Function to extract the relative path from gs:// URL
get_relative_path() {
    local gs_path=$1
    # Remove gs://bucket-name/ prefix
    echo "$gs_path" | sed 's|gs://[^/]*/||'
}

if [ "$ACTION" = "search" ]; then
    echo "Found directories:"
    echo "$all_dirs" | while read -r dir; do
        echo "  $dir"
    done
elif [ "$ACTION" = "download" ]; then
    # Create base directory if it doesn't exist
    mkdir -p "$LOCAL_BASE_DIR"
    
    echo "$all_dirs" | while read -r dir; do
        echo "Downloading directory: $dir"
        relative_path=$(get_relative_path "$dir")
        local_dir="$LOCAL_BASE_DIR/$relative_path"
        
        # Create local directory
        mkdir -p "$local_dir"
        
        # Download the entire directory
        gcloud storage cp -r "$dir*" "$local_dir"
        
        if [ $? -eq 0 ]; then
            echo "Successfully downloaded: $dir"
        else
            echo "Failed to download: $dir"
        fi
    done
    
    echo "Download process completed!"
fi
