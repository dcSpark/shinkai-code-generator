# /// script
# requires-python = ">=3.10,<3.12"
# dependencies = [
#   "requests",
#   "youtube_transcript_api",
# ]
# ///

from typing import Any, Dict
import re
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled

def youtube_transcript_summarizer(transcript: str) -> str:
    return transcript[:200] + '...'

def extract_video_id(url: str) -> str:
    regex = r"v=([a-zA-Z0-9_-]{11})"
    match = re.search(regex, url)
    if match:
        return match.group(1)
    else:
        raise ValueError("Invalid YouTube URL")

def fetch_transcript(url: str) -> str:
    try:
        video_id = extract_video_id(url)
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        transcript = " ".join([item['text'] for item in transcript_list])
        return transcript
    except TranscriptsDisabled as e:
        return f"Error fetching transcript: {str(e)}"
    except ValueError as e:
        return f"Error fetching transcript: {str(e)}"
    except Exception as e:
        return f"Unexpected error: {str(e)}"

def process_video(url: str) -> Dict[str, Any]:
    transcript = fetch_transcript(url)
    if "Error fetching transcript" in transcript:
        return {"summary": transcript}
    else:
        summary = youtube_transcript_summarizer(transcript)
        return {"summary": summary}

class CONFIG:
    pass

class INPUTS:
    url: str

class OUTPUT:
    summary: str

async def run(config: CONFIG, inputs: INPUTS) -> OUTPUT:
    output = OUTPUT()
    output.summary = process_video(inputs.url)["summary"]
    return output