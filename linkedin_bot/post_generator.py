import time
import requests
from urllib.parse import quote

POLLINATIONS_TEXT_URL = "https://text.pollinations.ai/{prompt}"
MODEL = "openai"
TEMPERATURE = 0.7
MAX_RETRIES = 3
RETRY_DELAY = 20
TIMEOUT = 90

SYSTEM_PROMPT = (
    "Du bist ein erfahrener Social-Media-Manager für B2B-Thought-Leadership auf LinkedIn. "
    "Du schreibst auf Deutsch, präzise, inspirierend und ohne Buzzword-Bingo. "
    "Deine Beiträge sind strukturiert, auf den Punkt und enden mit einem klaren Call-to-Action. "
    "Du verwendest gelegentlich Emojis zur Strukturierung, aber sparsam (max. 5 pro Post). "
    "NIEMALS Hashtag-Spam. Maximal 3 thematisch passende Hashtags am Ende."
)

POST_PROMPT_TEMPLATE = """Erstelle einen LinkedIn-Post basierend auf diesem YouTube-Video von Christoph Magnussen.

**Video-Titel:** {title}

**Transkript-Auszug:**
{transcript}

**Anforderungen:**
- Genau 14–16 Zeilen lang (ca. 200–280 Wörter)
- Erste Zeile: starker Hook (Frage ODER überraschende Aussage)
- Leerzeile nach dem Hook für Suspense
- Hauptteil: 3–4 konkrete Kernbotschaften aus dem Video als kurze Absätze
- Vorletzter Absatz: persönliche Reflexion oder Meinung von Christoph
- Letzte Zeile: Call-to-Action + Video-Link: {url}
- Am Ende: genau 2–3 relevante Hashtags
- Ton: direkt, professionell, authentisch – kein Marketing-Slang
- Schreibe den Post fertig, als würde Christoph ihn selbst posten

Gib NUR den fertigen LinkedIn-Post aus, keine Erklärungen drumherum."""


def generate_linkedin_post(title: str, transcript: str, video_url: str = "") -> str:
    prompt = POST_PROMPT_TEMPLATE.format(
        title=title,
        transcript=transcript[:8000],
        url=video_url,
    )

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            encoded_prompt = quote(prompt)
            url = POLLINATIONS_TEXT_URL.format(prompt=encoded_prompt)
            response = requests.get(
                url,
                params={"model": MODEL, "temperature": TEMPERATURE, "system": SYSTEM_PROMPT},
                timeout=TIMEOUT,
            )
            response.raise_for_status()
            text = response.text.strip()
            if text:
                return text
            print(f"  Empty response from Pollinations (attempt {attempt}), retrying...")
        except requests.RequestException as e:
            print(f"  Pollinations text API error (attempt {attempt}): {e}")

        if attempt < MAX_RETRIES:
            time.sleep(RETRY_DELAY)

    # Fallback: minimal placeholder so the HTML still gets written
    return (
        f"Neues Video von Christoph Magnussen: {title}\n\n"
        f"Schaut es euch an: {video_url}\n\n"
        "#Unternehmertum #Führung #Wachstum"
    )
