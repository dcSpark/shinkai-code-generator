# /// script
# requires-python = ">=3.10,<3.12"
# dependencies = [
#   "requests",
#   "yt-dlp",
#   "transformers",
#   "torch",
# ]
# ///

from typing import Any, Dict, Optional
from yt_dlp import YoutubeDL
from transformers import pipeline
import requests

class CONFIG:
    pass

class INPUTS:
    url: str
    lang: Optional[str] = None

class OUTPUT:
    summary: str

async def youtube_transcript_summarizer(input: Dict[str, Any]) -> Dict[str, Any]:
    url = input.get("url")
    lang = input.get("lang", "en")

    # Fetching the transcript
    ydl_opts = {
        'skip_download': True,
        'quiet': True,
        'writesubtitles': True,
        'subtitleslangs': [lang]
    }
    
    with YoutubeDL(ydl_opts) as ydl:
        result = ydl.extract_info(url, download=False)
        if 'requested_formats' in result:
            subtitles = result['requested_formats'][0].get('subtitles')
            if subtitles and lang in subtitles:
                transcript_url = subtitles[lang][0]['url']
                response = requests.get(transcript_url)
                transcript = response.text
            else:
                raise ValueError("Transcript not available")
        else:
            raise ValueError("Failed to extract video information")

    # Generate summary using a language model
    summarizer = pipeline("summarization")
    summary = summarizer(transcript, max_length=130, min_length=30, do_sample=False)
    
    return {"summary": summary[0]['summary_text']}

async def run(config: CONFIG, inputs: Dict[str, Any]) -> OUTPUT:
    output = OUTPUT()
    result = await youtube_transcript_summarizer(inputs)
    output.summary = result['summary']
    return output