# Requirements
A tool that takes a URL as input and returns the complete HTML content of the website as a string.

# System Libraries
fetch : Fetch API for making HTTP requests to download web pages
response : Built-in type for handling HTTP responses

# Internal Libraries
downloadPages : Converts HTML content to Markdown (not needed for this task)
readFileContents : Reads file contents from a path (not needed for this task)

# External Libraries
 Cheerio : For parsing and manipulating HTML if needed (not required for basic download)
 Puppeteer : For advanced web scraping with JavaScript rendering (not needed for basic download)

# Example Inputs and Outputs  
Input: { "url": "https://example.com" }
Output: { "content": "<html>...</html>" }