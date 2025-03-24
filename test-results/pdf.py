# /// script
# dependencies = [
#   "PyMuPDF",
#   "requests",
# ]
# ///

from typing import Dict
import fitz  # PyMuPDF

class CONFIG:
    output_directory: str

class INPUTS:
    file_path: str

class OUTPUT:
    text: str

async def run(config: CONFIG, inputs: INPUTS) -> OUTPUT:
    # Extract text from PDF
    result = pdf_to_text(inputs.file_path)  
    return OUTPUT(text=result['text'])

def pdf_to_text(file_path: str) -> Dict[str, str]:
    """
    Extracts plain text from a PDF file and returns it in a structured format.
    
    Args:
        file_path (str): Path to the PDF file.
    
    Returns:
        Dict[str, str]: Contains extracted text in 'text' key.
    """
    try:
        with fitz.open(file_path) as doc:
            text_list = []
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                text = page.get_text().strip()
                text_list.append(text)
            full_text = "\n".join(text_list)
            return {"text": full_text}
    except Exception as e:
        raise ValueError(f"Failed to process PDF: {str(e)}")