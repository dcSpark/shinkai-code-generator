# /// script
# dependencies = [
#   "requests",
#   "pdfminer.six",
#   "typing-extensions",
# ]
# ///

from pdfminer.high_level import extract_text
from typing import Dict

class CONFIG:
    pass

class INPUTS:
    file_path: str

class OUTPUT:
    text: str

async def extract_text_from_pdf(file_path: str) -> Dict[str, str]:
    try:
        text = extract_text(file_path)
        return {"text": text}
    except FileNotFoundError:
        return {"error": "File not found. Please check the file path."}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

async def run(config: CONFIG, inputs: INPUTS) -> OUTPUT:
    result = await extract_text_from_pdf(inputs.file_path)
    
    output = OUTPUT()
    output.text = result.get("text", "")
    return output