# /// script
# requires-python = ">=3.10,<3.12"
# dependencies = [
#   "requests",
#   "PyPDF2",
#   "pdfminer.six",
# ]
# ///

from PyPDF2 import PdfReader
from pdfminer.high_level import extract_text as pdfminer_extract_text

class CONFIG:
    pass

class INPUTS:
    pdf_path: str

class OUTPUT:
    text: str

def extract_text_from_pdf(pdf_path: str) -> str:
    try:
        # Try using PyPDF2 first
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text
        
        if text.strip():
            return text
    except Exception as e:
        print(f"PyPDF2 failed to extract text: {e}")

    try:
        # If PyPDF2 fails, use pdfminer.six
        text = pdfminer_extract_text(pdf_path)
        return text
    except Exception as e:
        print(f"pdfminer.six failed to extract text: {e}")
    
    # If both methods fail, return an error message
    return "Failed to extract text from the PDF file."

async def run(config: CONFIG, inputs: INPUTS) -> OUTPUT:
    pdf_path = inputs.pdf_path
    text = extract_text_from_pdf(pdf_path)
    
    output = OUTPUT()
    output.text = text
    return output