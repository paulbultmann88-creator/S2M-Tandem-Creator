import json
import feedparser

RSS_TEMPLATE = "https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"


def load_state(state_file: str) -> dict:
    try:
        with open(state_file, "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"last_video_id": None}


def save_state(state_file: str, state: dict) -> None:
    with open(state_file, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)


def get_new_videos(channel_id: str, state: dict) -> list[dict]:
    """
    Returns new videos (newest-first) published after last_video_id.
    On first run (last_video_id=None), returns only the single latest video.
    """
    url = RSS_TEMPLATE.format(channel_id=channel_id)
    feed = feedparser.parse(url)

    if feed.bozo and not feed.entries:
        print(f"RSS fetch failed or empty: {feed.bozo_exception}")
        return []

    last_id = state.get("last_video_id")
    new_videos = []

    for entry in feed.entries:
        video_id = entry.get("yt_videoid") or entry.id.split(":")[-1]
        if video_id == last_id:
            break
        new_videos.append({
            "video_id": video_id,
            "title": entry.title,
            "url": f"https://www.youtube.com/watch?v={video_id}",
            "published": entry.get("published", ""),
            "description": entry.get("summary", ""),
        })

    # First run: only process the latest video, not the full backlog
    if last_id is None and new_videos:
        return [new_videos[0]]

    return new_videos
