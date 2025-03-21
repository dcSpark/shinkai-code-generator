# /// script
# requires-python = ">=3.10,<3.12"
# dependencies = [
#   "requests",
#   "html2text",
# ]
# ///

import requests
import html2text

class CONFIG:
    pass

class INPUTS:
    url: str

class OUTPUT:
    markdown: str

async def run(config: CONFIG, inputs: INPUTS) -> OUTPUT:
    url = inputs.url
    
    # Download the HTML content from the URL
    response = requests.get(url)
    response.raise_for_status()  # Ensure we notify of bad response
    
    html_content = response.text
    
    # Convert HTML to markdown
    markdown_content = html2text.html2text(html_content)
    
    # Prepare the output
    output = OUTPUT()
    output.markdown = markdown_content
    
    return output