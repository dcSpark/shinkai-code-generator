# /// script
# dependencies = [
#   "requests",
#   "beautifulsoup4",
#   "markdownify",
# ]
# ///

from typing import Dict, Any
import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md

class CONFIG:
    pass

class INPUTS:
    url: str

class OUTPUT:
    markdown: str

async def download_pages(input: Dict[str, Any]) -> Dict[str, Any]:
    url = input.get("url")
    if not url:
        raise ValueError("The input must contain a 'url' key with a valid URL string.")
    
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an HTTPError for bad responses
    except requests.RequestException as e:
        raise RuntimeError(f"Failed to download the page: {e}")

    # Parse the HTML content
    soup = BeautifulSoup(response.content, 'html.parser')

    # Convert HTML to markdown
    markdown_content = md(str(soup))
    
    return {"markdown": markdown_content}

async def run(input: Dict[str, Any], config: Dict[str, Any]) -> Dict[str, Any]:
    try:
        result = await download_pages(input)
        return result
    except Exception as e:
        return {"error": str(e)}