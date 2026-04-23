import time
import random
import requests
from urllib.parse import quote

POLLINATIONS_IMAGE_URL = "https://image.pollinations.ai/prompt/{prompt}"
IMAGE_WIDTH = 1200
IMAGE_HEIGHT = 630
MODEL = "flux"
MAX_RETRIES = 3
RETRY_DELAY = 20
TIMEOUT = 120

IMAGE_PROMPT_TEMPLATE = (
    "Professional LinkedIn banner image for a business thought leadership post. "
    "Topic: {topic}. "
    "Style: modern, clean, corporate, minimal. "
    "Color palette: deep blue and white with subtle gold accents. "
    "No text overlay. No people's faces. Abstract geometric shapes or icons. "
    "High resolution, 4K quality."
)


def generate_and_save_image(title: str, output_path: str) -> bool:
    """Downloads and saves a generated image. Returns True on success."""
    topic = title[:80].strip()
    image_prompt = IMAGE_PROMPT_TEMPLATE.format(topic=topic)
    seed = random.randint(1, 999999)

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            encoded_prompt = quote(image_prompt)
            url = POLLINATIONS_IMAGE_URL.format(prompt=encoded_prompt)
            response = requests.get(
                url,
                params={
                    "width": IMAGE_WIDTH,
                    "height": IMAGE_HEIGHT,
                    "model": MODEL,
                    "seed": seed,
                    "nologo": "true",
                },
                timeout=TIMEOUT,
            )
            response.raise_for_status()
            content_type = response.headers.get("content-type", "")
            if content_type.startswith("image/"):
                with open(output_path, "wb") as f:
                    f.write(response.content)
                print(f"  Image saved: {output_path} ({len(response.content)} bytes)")
                return True
            print(f"  Unexpected content-type: {content_type}")
        except requests.RequestException as e:
            print(f"  Pollinations image API error (attempt {attempt}): {e}")

        if attempt < MAX_RETRIES:
            time.sleep(RETRY_DELAY)

    print(f"  Image generation failed after {MAX_RETRIES} attempts.")
    return False
