---
name: accenture-design
description: >
  Accenture corporate design system for slides and documents — brand colors,
  typography, layout principles, the ">" graphic device, and ready-to-use
  python-pptx build patterns for on-brand PowerPoint decks. Use when designing
  any presentation, report, or visual "in Accenture style / im Accenture Design".
---

# Accenture Corporate Design — Skill

Apply this system whenever you design Accenture-branded slides. Core color,
typography and layout rules below are high-confidence. Items flagged **(verify)**
should be confirmed against the official Accenture Brand Space / brand portal
before external use — exact secondary hexes occasionally change with refreshes.

## 1. Brand essence

Accenture's visual language is **bold, minimal, optimistic and human**. The
anchor is a vivid **purple** plus black and white, enormous white space, strong
type, and the signature **`>` (greater-than)** symbol — drawn from the wordmark
and used as a graphic device meaning "forward / change / progress".

Design feels editorial and confident: few elements, one idea per slide, high
contrast, no decoration for decoration's sake.

## 2. Color system

### Core (high confidence)
| Role | Name | HEX | RGB |
|------|------|-----|-----|
| Primary | Accenture Purple | `#A100FF` | 161, 0, 255 |
| Neutral | Black | `#000000` | 0, 0, 0 |
| Neutral | White | `#FFFFFF` | 255, 255, 255 |

### Purple depth ramp (for fills, dividers, gradients)
| Name | HEX |
|------|-----|
| Deep purple | `#460073` |
| Dark purple | `#7500C0` |
| Core purple | `#A100FF` |
| Light purple | `#B455F0` *(verify)* |
| Tint purple | `#E6CCFF` *(verify)* |

### Greys (text, rules, backgrounds)
| Name | HEX |
|------|-----|
| Near-black text | `#2B2B2B` |
| Body grey | `#555555` |
| Mid grey | `#919191` |
| Light grey rule | `#D9D9D9` |
| Off-white bg | `#F2F2F2` |

### Accent brights — use sparingly, mainly for data viz / gradients **(verify)**
| Name | HEX |
|------|-----|
| Blue | `#0041F0` |
| Cyan | `#00B7FF` |
| Magenta / Pink | `#FF50A0` |
| Green | `#64D200` |

**Usage rules**
- Purple is the hero. Black/white/grey carry 80–90% of the surface; purple is the
  accent that draws the eye to the one thing that matters per slide.
- Don't tint text in many colors. Body copy is near-black on white, or white on
  purple/black. Reserve brights for charts.
- Gradients (purple → magenta → blue) are an Accenture signature — use on cover /
  section dividers, never behind body text.
- Always meet **WCAG AA** contrast. White text on `#A100FF` passes for large/bold
  text; for small text prefer black or `#460073` backgrounds.

## 3. Typography

- **Brand typeface: Graphik** (Graphik Semibold for headlines, Graphik Regular /
  Medium for body). Secondary: **Graphik Compact** for tight UI labels.
- **Office-safe fallback** (when Graphik isn't installed, e.g. generated pptx):
  `Segoe UI` → `Arial`. State the fallback when you use it.
- Hierarchy (16:9 deck, points):
  - Cover headline: 40–54 pt, Semibold/Bold
  - Slide title (takeaway): 24–30 pt, Semibold
  - Body / bullets: 14–18 pt, Regular
  - Caption / source: 9–10 pt, Regular, mid grey
- **Left-align** almost everything. Avoid centered paragraphs and ALL-CAPS
  blocks (small caps / tracking for kickers is fine).
- Tight, purposeful copy. Headlines are sentences that state the point.

## 4. The ">" device

- The greater-than sign is the brand's signature mark. Use it (in purple) as:
  a kicker before a section label (`> Strategy`), a "next/continue" cue, an
  oversized graphic accent on dividers, or a custom bullet.
- Keep it monoline, purple `#A100FF`, never distorted. Don't overuse — one
  strong usage per slide at most.

## 5. Layout principles

- **16:9** (13.333 × 7.5 in). Margins generous: ~0.6–0.9 in.
- One idea per slide. Headline top-left = the takeaway.
- Strong grid; align to a few columns. Whitespace is a feature, not waste.
- Logo: wordmark top-left or bottom-left, with clear space ≥ the height of the
  "a". Never recolor, stretch, or add effects. (Don't fabricate a logo image; if
  none is supplied, leave a clearly marked placeholder text box.)
- Footer: thin grey rule + page number + confidentiality note if needed.

## 6. Slide archetypes

1. **Cover** — black or purple-gradient field, big white headline, `>` accent,
   subtitle, date/author small.
2. **Section divider** — solid purple or deep-purple, oversized white section
   number/title, `>` motif.
3. **Content** — white bg, takeaway title, 3–5 column cards or a bullet column +
   visual. Lots of air.
4. **KPI / hero number** — one or few large purple numbers with short labels.
5. **Data** — chart left/large, insight callout right; purple primary series.
6. **Closing** — "Let there be change"-style statement, contact, `>`.

## 7. python-pptx build pattern

Use this as the starting scaffold; adapt per deck. Produces an editable 16:9
deck with brand colors and helpers.

```python
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

# --- Brand constants ---
PURPLE      = RGBColor(0xA1, 0x00, 0xFF)
DEEP_PURPLE = RGBColor(0x46, 0x00, 0x73)
BLACK       = RGBColor(0x00, 0x00, 0x00)
WHITE       = RGBColor(0xFF, 0xFF, 0xFF)
NEAR_BLACK  = RGBColor(0x2B, 0x2B, 0x2B)
GREY        = RGBColor(0x91, 0x91, 0x91)
OFFWHITE    = RGBColor(0xF2, 0xF2, 0xF2)
FONT_HEAD   = "Segoe UI"   # fallback for Graphik Semibold
FONT_BODY   = "Segoe UI"   # fallback for Graphik Regular

prs = Presentation()
prs.slide_width  = Inches(13.333)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]

def add_rect(slide, x, y, w, h, fill):
    from pptx.enum.shapes import MSO_SHAPE
    shp = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, h)
    shp.fill.solid(); shp.fill.fore_color.rgb = fill
    shp.line.fill.background()
    shp.shadow.inherit = False
    return shp

def add_text(slide, x, y, w, h, text, size, color, bold=False,
             font=FONT_BODY, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP):
    tb = slide.shapes.add_textbox(x, y, w, h); tf = tb.text_frame
    tf.word_wrap = True; tf.vertical_anchor = anchor
    p = tf.paragraphs[0]; p.alignment = align
    r = p.add_run(); r.text = text
    f = r.font; f.size = Pt(size); f.bold = bold
    f.name = font; f.color.rgb = color
    return tb

def cover(title, subtitle, meta=""):
    s = prs.slides.add_slide(BLANK)
    add_rect(s, 0, 0, prs.slide_width, prs.slide_height, BLACK)
    add_rect(s, Inches(0.9), Inches(2.4), Inches(0.12), Inches(1.6), PURPLE)  # purple bar
    add_text(s, Inches(1.2), Inches(2.2), Inches(10.5), Inches(2.2),
             title, 46, WHITE, bold=True, font=FONT_HEAD)
    add_text(s, Inches(1.2), Inches(4.3), Inches(9.5), Inches(1.0),
             subtitle, 18, RGBColor(0xCC,0xCC,0xCC))
    add_text(s, Inches(1.2), Inches(6.6), Inches(9), Inches(0.5),
             meta, 11, GREY)
    add_text(s, Inches(11.9), Inches(0.5), Inches(1), Inches(0.6),
             ">", 40, PURPLE, bold=True, font=FONT_HEAD)
    return s

def section(label, number=""):
    s = prs.slides.add_slide(BLANK)
    add_rect(s, 0, 0, prs.slide_width, prs.slide_height, PURPLE)
    add_text(s, Inches(0.9), Inches(1.0), Inches(6), Inches(1),
             f"> {number}", 24, WHITE, bold=True, font=FONT_HEAD)
    add_text(s, Inches(0.9), Inches(2.8), Inches(11), Inches(2.5),
             label, 40, WHITE, bold=True, font=FONT_HEAD)
    return s

def content(title):
    s = prs.slides.add_slide(BLANK)
    add_rect(s, 0, 0, prs.slide_width, prs.slide_height, WHITE)
    add_text(s, Inches(0.9), Inches(0.6), Inches(11.5), Inches(1.0),
             title, 28, NEAR_BLACK, bold=True, font=FONT_HEAD)
    add_rect(s, Inches(0.9), Inches(1.55), Inches(1.1), Inches(0.06), PURPLE)
    # footer rule + page handled separately
    return s
```

### Verification step
If a renderer is available, convert and eyeball:
`soffice --headless --convert-to pdf deck.pptx` → render pages with pdfium.
Otherwise tell the user you could not visually verify and recommend a quick look
in PowerPoint.

## 8. Don'ts
- No clip-art, stock-photo overload, drop shadows on text, bevels, or 3-D charts.
- No more than ~2 accent colors per chart; never a full rainbow.
- No centered body paragraphs; no walls of text (≤ ~6 lines / slide ideal).
- Don't recolor or distort the logo or the `>`.
