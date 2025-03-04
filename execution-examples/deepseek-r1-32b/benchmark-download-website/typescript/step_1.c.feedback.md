# Requirements
A tool that takes a URL as input and returns the complete HTML content of the website as a string.

# System Libraries
axios  : For making HTTP requests to download web pages

# Internal Libraries
downloadPages  : Converts HTML content to Markdown (not needed for this task)
readFileContents  : Reads file contents from a path (not needed for this task)

# External Libraries
axios  : HTTP client library for making GET requests to websites

# Example Inputs and Outputs  
Input: { "url": "https://example.com" }
Output: { "content": "<html>...</html>" }