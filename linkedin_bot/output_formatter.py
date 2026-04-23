import os
from datetime import datetime
from jinja2 import Template

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LinkedIn Post – {{ video_title }}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 680px;
      margin: 40px auto;
      padding: 20px;
      background: #f3f2ef;
      color: #1a1a1a;
    }
    .meta {
      font-size: 12px;
      color: #666;
      margin-bottom: 24px;
      padding-bottom: 12px;
      border-bottom: 1px solid #ddd;
    }
    .meta a { color: #0a66c2; text-decoration: none; }
    .meta a:hover { text-decoration: underline; }
    .image-wrap {
      margin-bottom: 24px;
      border-radius: 8px;
      overflow: hidden;
    }
    .image-wrap img {
      width: 100%;
      display: block;
      border-radius: 8px;
    }
    .no-image {
      background: #e1e9f0;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      color: #888;
      font-size: 13px;
      margin-bottom: 24px;
    }
    .post-box {
      background: white;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .post-text {
      white-space: pre-wrap;
      line-height: 1.65;
      font-size: 15px;
    }
    .copy-btn {
      margin-top: 20px;
      display: block;
      width: 100%;
      padding: 12px;
      background: #0a66c2;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 15px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.2s;
    }
    .copy-btn:hover { background: #004182; }
    .copy-btn.copied { background: #057642; }
    .footer {
      text-align: center;
      font-size: 11px;
      color: #aaa;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="meta">
    <strong>Video:</strong> <a href="{{ video_url }}" target="_blank">{{ video_title }}</a><br>
    <strong>Veröffentlicht:</strong> {{ video_published }}<br>
    <strong>Video-ID:</strong> {{ video_id }}
  </div>

  {% if image_filename %}
  <div class="image-wrap">
    <img src="{{ image_filename }}" alt="LinkedIn Post Bild">
  </div>
  {% else %}
  <div class="no-image">Kein Bild verfügbar</div>
  {% endif %}

  <div class="post-box">
    <div class="post-text" id="postText">{{ post_text }}</div>
    <button class="copy-btn" onclick="copyPost()">📋 LinkedIn-Text kopieren</button>
  </div>

  <div class="footer">Automatisch generiert am {{ generated_at }} · Christoph Magnussen YouTube Monitor</div>

  <script>
    function copyPost() {
      const text = document.getElementById('postText').innerText;
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.copy-btn');
        btn.textContent = '✅ Kopiert!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = '📋 LinkedIn-Text kopieren';
          btn.classList.remove('copied');
        }, 3000);
      });
    }
  </script>
</body>
</html>"""


def render_html_output(
    video: dict,
    post_text: str,
    image_filename: str | None,
    output_path: str,
) -> None:
    template = Template(HTML_TEMPLATE)
    html = template.render(
        video_id=video["video_id"],
        video_title=video["title"],
        video_url=video["url"],
        video_published=video.get("published", ""),
        post_text=post_text,
        image_filename=image_filename,
        generated_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
    )
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)
