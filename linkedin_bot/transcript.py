from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    NoTranscriptFound,
    TranscriptsDisabled,
    VideoUnavailable,
)

MAX_CHARS = 12_000


def get_transcript(video_id: str) -> str | None:
    """
    Tries German first, then English. Returns plain text or None if unavailable.
    On IP block, raises so caller can avoid advancing state.
    """
    api = YouTubeTranscriptApi()
    try:
        transcript_list = api.list(video_id)
        try:
            transcript = transcript_list.find_transcript(["de", "en"])
        except NoTranscriptFound:
            transcript = transcript_list.find_generated_transcript(["de", "en"])
        fetched = transcript.fetch()
    except TranscriptsDisabled:
        print(f"  Transcripts disabled for {video_id}")
        return None
    except VideoUnavailable:
        print(f"  Video unavailable: {video_id}")
        return None
    except NoTranscriptFound:
        print(f"  No transcript found for {video_id}")
        return None
    except Exception as e:
        # Re-raise IP-block errors so main.py does not advance state
        if "blocked" in str(e).lower() or "ipblocked" in type(e).__name__.lower():
            raise
        print(f"  Unexpected transcript error for {video_id}: {e}")
        return None

    full_text = " ".join(seg.text for seg in fetched)
    if len(full_text) > MAX_CHARS:
        full_text = full_text[:MAX_CHARS] + "..."
    return full_text.strip()
