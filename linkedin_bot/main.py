import os
import sys
from linkedin_bot.rss_monitor import get_new_videos, load_state, save_state
from linkedin_bot.transcript import get_transcript
from linkedin_bot.post_generator import generate_linkedin_post
from linkedin_bot.image_generator import generate_and_save_image
from linkedin_bot.output_formatter import render_html_output

CHANNEL_ID = "UCDx6L69jmKBJbNu5GnkCilg"  # Christoph Magnussen (@blackboat)
STATE_FILE = "last_seen.json"
POSTS_DIR = "posts"


def main():
    state = load_state(STATE_FILE)
    new_videos = get_new_videos(CHANNEL_ID, state)

    if not new_videos:
        print("No new videos found. Exiting.")
        sys.exit(0)

    for video in new_videos:
        print(f"Processing: {video['title']} ({video['video_id']})")

        try:
            transcript_text = get_transcript(video["video_id"])
        except Exception as e:
            # IP block or similar – do NOT advance state, retry next run
            print(f"  Transcript fetch blocked, will retry next run: {e}")
            sys.exit(1)

        if transcript_text is None:
            print(f"  Transcript unavailable, skipping post generation.")
            state["last_video_id"] = video["video_id"]
            save_state(STATE_FILE, state)
            continue

        post_text = generate_linkedin_post(
            video["title"], transcript_text, video["url"]
        )

        image_filename = f"{video['video_id']}.jpg"
        image_path = os.path.join(POSTS_DIR, image_filename)
        image_ok = generate_and_save_image(video["title"], image_path)

        html_path = os.path.join(POSTS_DIR, f"{video['video_id']}.html")
        render_html_output(
            video=video,
            post_text=post_text,
            image_filename=image_filename if image_ok else None,
            output_path=html_path,
        )
        print(f"  Output written to {html_path}")

        # Export for GitHub Actions commit message
        github_env = os.environ.get("GITHUB_ENV", "/dev/null")
        with open(github_env, "a") as f:
            f.write(f"NEW_VIDEO_ID={video['video_id']}\n")

        state["last_video_id"] = video["video_id"]
        save_state(STATE_FILE, state)


if __name__ == "__main__":
    main()
