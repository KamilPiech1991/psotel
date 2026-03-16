#!/usr/bin/env python3
"""
Auto Blog Publisher for AP Dent Piaseczno
Generates SEO-optimized dental blog posts using Claude API and publishes to WordPress.
Includes stock photos from Pexels and styled HTML matching AP Dent blog design.

Usage:
    python3 auto_blog.py              # Publish next post from topics.json
    python3 auto_blog.py --dry-run    # Generate post but don't publish
    python3 auto_blog.py --preview    # Show which topic is next without generating

Requires .env file with:
    WP_URL=https://apdentpiaseczno.pl
    WP_USER=your_username
    WP_PASSWORD=your_app_password
    ANTHROPIC_API_KEY=sk-ant-...
    PEXELS_API_KEY=your_pexels_key (optional, for stock photos)
"""

import json
import re
import os
import sys
import argparse
import logging
from datetime import datetime
from pathlib import Path

import anthropic
import requests

SCRIPT_VERSION = "2.0"

# --- Config ---
SCRIPT_DIR = Path(__file__).parent
TOPICS_FILE = SCRIPT_DIR / "topics.json"
STATE_FILE = SCRIPT_DIR / "state.json"
LOG_FILE = SCRIPT_DIR / "auto_blog.log"

# .env: first check script directory, then home directory
ENV_FILE_LOCAL = SCRIPT_DIR / ".env"
ENV_FILE_HOME = Path.home() / ".env"

CLAUDE_MODEL = "claude-sonnet-4-20250514"
MAX_TOKENS = 8192

# --- Logging ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(),
    ],
)
log = logging.getLogger(__name__)


def load_env():
    """Load environment variables from .env file (local dir first, then home dir)."""
    env_file = None
    if ENV_FILE_LOCAL.exists():
        env_file = ENV_FILE_LOCAL
    elif ENV_FILE_HOME.exists():
        env_file = ENV_FILE_HOME

    if env_file:
        log.info(f"Loading .env from: {env_file}")
        for line in env_file.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                os.environ.setdefault(key.strip(), value.strip())
    else:
        log.warning(f"No .env file found in {SCRIPT_DIR} or {ENV_FILE_HOME.parent}")

    required = ["WP_URL", "WP_USER", "WP_PASSWORD", "ANTHROPIC_API_KEY"]
    missing = [k for k in required if not os.environ.get(k)]
    if missing:
        log.error(f"Missing environment variables: {', '.join(missing)}")
        log.error(f"Create .env in {SCRIPT_DIR} or {ENV_FILE_HOME}")
        sys.exit(1)

    # Log Pexels API status
    if os.environ.get("PEXELS_API_KEY"):
        log.info("PEXELS_API_KEY: found")
    else:
        log.warning("PEXELS_API_KEY: NOT SET - posts will be published WITHOUT images")
        log.warning(f"Add PEXELS_API_KEY=your_key to {env_file or SCRIPT_DIR / '.env'}")


def load_state():
    """Load publishing state (which topics have been published)."""
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text())
    return {"published": [], "last_run": None}


def save_state(state):
    """Save publishing state."""
    STATE_FILE.write_text(json.dumps(state, indent=2, ensure_ascii=False))


def get_next_topic(topics, state):
    """Get the next unpublished topic."""
    published_keywords = set(state["published"])
    for topic in topics:
        if topic["keyword"] not in published_keywords:
            return topic
    return None


# --- Pexels Integration ---

def fetch_pexels_photos(query, count=2):
    """Fetch dental stock photos from Pexels API."""
    api_key = os.environ.get("PEXELS_API_KEY")
    if not api_key:
        log.warning("[PHOTOS] PEXELS_API_KEY not set - skipping stock photos")
        return []

    try:
        log.info(f"[PHOTOS] Calling Pexels API: query='{query}', count={count}")
        r = requests.get(
            "https://api.pexels.com/v1/search",
            headers={"Authorization": api_key},
            params={"query": query, "per_page": count, "orientation": "landscape", "locale": "pl-PL"},
            timeout=15,
        )
        if r.status_code != 200:
            log.warning(f"[PHOTOS] Pexels API error {r.status_code}: {r.text[:200]}")
            return []

        photos = r.json().get("photos", [])
        log.info(f"[PHOTOS] Pexels returned {len(photos)} photos")
        return [
            {
                "url": p["src"]["large2x"],
                "alt": p.get("alt", query),
                "photographer": p["photographer"],
            }
            for p in photos
        ]
    except requests.RequestException as e:
        log.warning(f"Pexels request failed: {e}")
        return []


def upload_image_to_wordpress(image_url, alt_text, filename):
    """Download image from URL and upload to WordPress media library."""
    wp_url = os.environ["WP_URL"]
    auth = (os.environ["WP_USER"], os.environ["WP_PASSWORD"])

    try:
        img_resp = requests.get(
            image_url,
            timeout=30,
            headers={"User-Agent": "Mozilla/5.0 (compatible; APDentBot/1.0)"},
        )
        if img_resp.status_code != 200:
            log.warning(f"Failed to download image ({img_resp.status_code}): {image_url}")
            return None

        if len(img_resp.content) == 0:
            log.warning(f"Downloaded image is empty: {image_url}")
            return None

        content_type = img_resp.headers.get("Content-Type", "image/jpeg")
        # Strip charset or extra params from content type
        content_type = content_type.split(";")[0].strip()
        ext = "webp" if "webp" in content_type else "jpg"
        full_filename = f"{filename}.{ext}"
        log.info(f"[PHOTOS] Downloaded {len(img_resp.content)} bytes, type={content_type}")

        r = requests.post(
            f"{wp_url}/wp-json/wp/v2/media",
            auth=auth,
            headers={
                "Content-Disposition": f'attachment; filename="{full_filename}"',
                "Content-Type": content_type,
            },
            data=img_resp.content,
            timeout=30,
        )

        if r.status_code != 201:
            log.warning(f"WordPress media upload failed: {r.status_code} - {r.text[:500]}")
            return None

        media = r.json()
        media_id = media["id"]
        media_url = media["source_url"]
        log.info(f"Uploaded image ID {media_id}: {media_url}")

        # Set alt text
        requests.post(
            f"{wp_url}/wp-json/wp/v2/media/{media_id}",
            auth=auth,
            json={"alt_text": alt_text},
            timeout=10,
        )

        return {"id": media_id, "url": media_url, "alt": alt_text}

    except requests.RequestException as e:
        log.warning(f"Image upload failed: {e}")
        return None


# --- Content Generation ---

def generate_post(topic):
    """Generate a blog post using Claude API with enhanced formatting.

    Uses a two-step approach to avoid JSON parsing issues with long HTML content:
    Step 1: Generate HTML content as raw text
    Step 2: Generate metadata (title, slug, FAQ, etc.) as JSON
    """
    client = anthropic.Anthropic()

    # --- Step 1: Generate HTML content ---
    content_prompt = f"""Napisz artykuł blogowy dla kliniki stomatologicznej AP Dent w Piasecznie.

TEMAT: {topic['title_hint']}
FRAZA KLUCZOWA: {topic['keyword']}
KĄT ARTYKUŁU: {topic['angle']}

WYMAGANIA DOTYCZĄCE TREŚCI:
1. Artykuł 1500-2200 słów, w języku polskim
2. Naturalnie wpleć frazę kluczową "{topic['keyword']}" 6-10 razy (w nagłówkach H2, pierwszym akapicie, CTA, FAQ, podsumowaniu)
3. Ton: profesjonalny ale przystępny, empatyczny wobec pacjentów
4. Wspominaj o AP Dent Piaseczno (ul. Pelikanów 2D) naturalnie, 3-4 razy w artykule
5. Godziny: pon-pt 8:00-20:00, sob 8:00-14:00, tel. 22 702 54 70
6. Dodawaj linki wewnętrzne do usług AP Dent tam, gdzie pasują (format: <a href="https://apdentpiaseczno.pl/uslugi/NAZWA/">tekst</a>). Dostępne usługi: implanty, ortodoncja, protetyka, endodoncja, chirurgia, stomatologia-estetyczna, stomatologia-dziecieca, higiena, radiologia, periodontologia

WYMAGANA STRUKTURA HTML (dokładnie w tej kolejności):

1. TL;DR na początku — sekcja ze skrótem najważniejszych informacji:
<p><strong>TL;DR – najważniejsze w skrócie:</strong></p>
<ul class="wp-block-list">
<li>Punkt 1...</li>
<li>Punkt 2...</li>
<li>Punkt 3...</li>
<li><strong>AP Dent przy ul. Pelikanów 2D w Piasecznie</strong> — punkt z odniesieniem do kliniki.</li>
</ul>

2. PLACEHOLDER na zdjęcie — od razu po sekcji TL;DR wstaw dokładnie ten znacznik:
<!-- PHOTO_PLACEHOLDER_1 -->

3. Akapit wprowadzający — chwytający uwagę, z frazą kluczową.

4. 4-6 sekcji tematycznych z nagłówkami H2 (class="wp-block-heading"):
<h2 class="wp-block-heading">Nagłówek sekcji z frazą kluczową</h2>
- Każda sekcja 2-4 akapity
- Używaj <strong> do wyróżnienia kluczowych fraz
- Dodawaj listy <ul class="wp-block-list"> gdzie pasują
- Wstawiaj linki wewnętrzne do usług AP Dent

5. PLACEHOLDER na drugie zdjęcie — po 3. sekcji tematycznej wstaw dokładnie ten znacznik:
<!-- PHOTO_PLACEHOLDER_2 -->

6. Sekcja CTA (call-to-action) — w środku artykułu, po 4. sekcji:
<p>Szukasz specjalisty w dziedzinie {topic['keyword']}?</p>
<p>AP Dent przy ul. Pelikanów 2D to klinika, w której [dopasuj do tematu].</p>
<p><strong>Zadzwoń: <a href="tel:+48227025470">22 702 54 70</a></strong><br />ul. Pelikanów 2D, 05-500 Piaseczno<br /><small>Pon.–Pt. 8:00–20:00  |  Sob. 8:00–14:00</small><br /><a href="https://apdentpiaseczno.pl/kontakt/">Umów wizytę online →</a></p>

7. Kolejne 2-3 sekcje z nagłówkami H2.

8. Podsumowanie — końcowy akapit z pogrubionym odniesieniem do AP Dent.

9. Sekcja FAQ — z nagłówkiem H2 i pytaniami jako H3:
<h2 class="wp-block-heading">Najczęściej zadawane pytania</h2>
<h3 class="wp-block-heading">Pytanie 1 z frazą kluczową?</h3>
<p>Odpowiedź z odniesieniem do AP Dent...</p>
(4 pytania FAQ)

10. CTA końcowe:
<p>Umów wizytę – już dziś</p>
<p>AP Dent Piaseczno  |  ul. Pelikanów 2D, 05-500 Piaseczno</p>
<p>Pon.–Pt. 8:00–20:00  |  Sob. 8:00–14:00<br /><a href="tel:+48227025470">Zadzwoń: 22 702 54 70</a>  <a href="https://apdentpiaseczno.pl/kontakt/">Formularz online →</a></p>

WAŻNE: Zwróć TYLKO czysty HTML artykułu. Bez żadnych komentarzy, wyjaśnień, bloków kodu — TYLKO HTML."""

    log.info(f"Generating post for: {topic['keyword']}")

    # Step 1: Get HTML content
    response1 = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=MAX_TOKENS,
        messages=[{"role": "user", "content": content_prompt}],
    )
    content_html = response1.content[0].text.strip()

    # Strip markdown code fences if present
    if content_html.startswith("```"):
        lines = content_html.split("\n")
        # Remove first line (```html) and last line (```)
        lines = [l for l in lines if not l.strip().startswith("```")]
        content_html = "\n".join(lines).strip()

    log.info(f"Generated HTML content ({len(content_html)} chars)")

    # --- Step 2: Generate metadata ---
    meta_prompt = f"""Na podstawie poniższego artykułu HTML, wygeneruj metadane w formacie JSON.

FRAZA KLUCZOWA: {topic['keyword']}

ARTYKUŁ:
{content_html[:500]}...

Zwróć TYLKO JSON w formacie:
{{
    "title": "Tytuł artykułu (max 70 znaków, z frazą kluczową)",
    "meta_description": "Meta description (max 155 znaków, z frazą kluczową)",
    "slug": "slug-artykulu-po-polsku",
    "photo_search_query": "short English query for dental stock photo, e.g. 'child at dentist smiling'",
    "photo_search_query_2": "DIFFERENT English query for a second dental photo matching a lower section of the article, e.g. 'dental tools close up'",
    "faq_schema": [
        {{"question": "Pytanie 1", "answer": "Krótka odpowiedź 1"}},
        {{"question": "Pytanie 2", "answer": "Krótka odpowiedź 2"}},
        {{"question": "Pytanie 3", "answer": "Krótka odpowiedź 3"}},
        {{"question": "Pytanie 4", "answer": "Krótka odpowiedź 4"}}
    ]
}}

Pytania FAQ powinny być zoptymalizowane pod frazę "{topic['keyword']}".
Odpowiedzi w faq_schema powinny być KRÓTKIE (1-2 zdania).
WAŻNE: Zwróć TYLKO JSON, bez żadnego tekstu."""

    response2 = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=2048,
        messages=[{"role": "user", "content": meta_prompt}],
    )

    meta_text = response2.content[0].text.strip()

    # Extract JSON from possible code fences
    if meta_text.startswith("```"):
        meta_text = meta_text.split("```")[1]
        if meta_text.startswith("json"):
            meta_text = meta_text[4:]
        meta_text = meta_text.strip()

    meta = json.loads(meta_text)
    meta["content_html"] = content_html

    log.info(f"Generated metadata: {meta['title']}")
    return meta


def insert_photos(content_html, photos, slug):
    """Upload photos and insert into content.

    Photo layout:
      photos[0] -> featured image only (not inserted into content)
      photos[1] -> replaces PHOTO_PLACEHOLDER_1 (after TL;DR)
      photos[2] -> replaces PHOTO_PLACEHOLDER_2 (mid-article)
    """
    uploaded = []
    for i, photo in enumerate(photos):
        img_data = upload_image_to_wordpress(
            photo["url"],
            photo["alt"],
            f"{slug}-img-{i+1}",
        )
        uploaded.append(img_data)  # Keep None to preserve index mapping

    def make_figure(img):
        return (
            f'<figure class="wp-block-image size-full">'
            f'<img loading="lazy" decoding="async" '
            f'src="{img["url"]}" alt="{img["alt"]}" '
            f'class="wp-image-{img["id"]}" />'
            f'</figure>'
        )

    # Photo after TL;DR (index 1)
    if len(uploaded) > 1 and uploaded[1]:
        content_html = content_html.replace(
            "<!-- PHOTO_PLACEHOLDER_1 -->", make_figure(uploaded[1])
        )
    else:
        content_html = content_html.replace("<!-- PHOTO_PLACEHOLDER_1 -->", "")

    # Photo mid-article (index 2)
    if len(uploaded) > 2 and uploaded[2]:
        content_html = content_html.replace(
            "<!-- PHOTO_PLACEHOLDER_2 -->", make_figure(uploaded[2])
        )
    else:
        content_html = content_html.replace("<!-- PHOTO_PLACEHOLDER_2 -->", "")

    # Featured image = first photo (index 0)
    featured_id = uploaded[0]["id"] if uploaded and uploaded[0] else None
    return content_html, featured_id


def build_faq_schema_html(faq_items):
    """Build FAQ Schema JSON-LD script tag."""
    schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": item["question"],
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item["answer"],
                },
            }
            for item in faq_items
        ],
    }
    return (
        '\n<script type="application/ld+json">\n'
        + json.dumps(schema, ensure_ascii=False, indent=2)
        + "\n</script>"
    )


def publish_to_wordpress(post_data, featured_image_id=None):
    """Publish post to WordPress via REST API."""
    wp_url = os.environ["WP_URL"]
    auth = (os.environ["WP_USER"], os.environ["WP_PASSWORD"])

    # Add FAQ schema to content
    content = post_data["content_html"]
    if post_data.get("faq_schema"):
        content += build_faq_schema_html(post_data["faq_schema"])

    # Create post
    payload = {
        "title": post_data["title"],
        "content": content,
        "slug": post_data["slug"],
        "status": "draft",
    }

    if featured_image_id:
        payload["featured_media"] = featured_image_id

    log.info(f"Publishing to WordPress: {post_data['title']}")
    r = requests.post(
        f"{wp_url}/wp-json/wp/v2/posts",
        auth=auth,
        json=payload,
    )

    if r.status_code != 201:
        log.error(f"WordPress error {r.status_code}: {r.text[:300]}")
        return None

    post_id = r.json()["id"]
    post_link = r.json()["link"]
    log.info(f"Created post ID {post_id}: {post_link}")

    # Set meta description via Rank Math
    r2 = requests.post(
        f"{wp_url}/wp-json/rankmath/v1/updateMeta",
        auth=auth,
        json={
            "objectType": "post",
            "objectID": post_id,
            "meta": {
                "rank_math_description": post_data["meta_description"],
                "rank_math_focus_keyword": post_data.get("keyword", ""),
            },
        },
    )

    if r2.status_code == 200:
        log.info(f"Rank Math meta set for post {post_id}")
    else:
        log.warning(f"Rank Math meta failed: {r2.status_code}")

    return post_id


def main():
    parser = argparse.ArgumentParser(description="Auto Blog Publisher for AP Dent")
    parser.add_argument("--dry-run", action="store_true", help="Generate but don't publish")
    parser.add_argument("--preview", action="store_true", help="Show next topic only")
    parser.add_argument("--publish", action="store_true", help="Publish immediately (not as draft)")
    args = parser.parse_args()

    log.info(f"=== AP Dent Auto Blog v{SCRIPT_VERSION} ===")

    load_env()

    # Load topics and state
    topics = json.loads(TOPICS_FILE.read_text())
    state = load_state()

    # Get next topic
    topic = get_next_topic(topics, state)
    if not topic:
        log.info("All topics have been published! Add more to topics.json")
        return

    if args.preview:
        log.info(f"Next topic: {topic['keyword']}")
        log.info(f"  Title: {topic['title_hint']}")
        log.info(f"  Angle: {topic['angle']}")
        remaining = len(topics) - len(state["published"])
        log.info(f"  Remaining: {remaining}/{len(topics)} topics")
        return

    # Generate post
    post_data = generate_post(topic)
    post_data["keyword"] = topic["keyword"]

    log.info(f"Generated: {post_data['title']}")
    log.info(f"Meta: {post_data['meta_description']}")
    log.info(f"Slug: {post_data['slug']}")

    # Fetch and upload photos (3 total: featured + 2 inline)
    featured_image_id = None
    photo_query = post_data.get("photo_search_query", f"dentist {topic['keyword']}")
    photo_query_2 = post_data.get("photo_search_query_2", f"dental clinic {topic['keyword']}")

    log.info(f"[PHOTOS] Searching Pexels for: '{photo_query}' (2 photos)")
    photos = fetch_pexels_photos(photo_query, count=2)

    log.info(f"[PHOTOS] Searching Pexels for: '{photo_query_2}' (1 photo)")
    photos_2 = fetch_pexels_photos(photo_query_2, count=1)
    photos.extend(photos_2)

    if photos:
        log.info(f"[PHOTOS] Found {len(photos)} stock photos, uploading to WordPress...")
        log.info(f"[PHOTOS] Content has PHOTO_PLACEHOLDER_1: {'<!-- PHOTO_PLACEHOLDER_1 -->' in post_data['content_html']}")
        log.info(f"[PHOTOS] Content has PHOTO_PLACEHOLDER_2: {'<!-- PHOTO_PLACEHOLDER_2 -->' in post_data['content_html']}")
        post_data["content_html"], featured_image_id = insert_photos(
            post_data["content_html"], photos, post_data["slug"]
        )
        log.info(f"[PHOTOS] Featured image ID: {featured_image_id}")
    else:
        post_data["content_html"] = post_data["content_html"].replace(
            "<!-- PHOTO_PLACEHOLDER_1 -->", ""
        ).replace("<!-- PHOTO_PLACEHOLDER_2 -->", "")
        log.warning("[PHOTOS] No stock photos found - publishing without images")

    if args.dry_run:
        output_file = SCRIPT_DIR / f"draft_{post_data['slug']}.json"
        output_file.write_text(json.dumps(post_data, ensure_ascii=False, indent=2))
        log.info(f"Dry run - saved to {output_file}")
        return

    # Publish
    post_id = publish_to_wordpress(post_data, featured_image_id)

    if post_id:
        state["published"].append(topic["keyword"])
        state["last_run"] = datetime.now().isoformat()
        state["last_post_id"] = post_id
        save_state(state)
        log.info(f"Done! Post ID {post_id} created as DRAFT. Review and publish in WordPress.")
    else:
        log.error("Failed to publish post")
        sys.exit(1)


if __name__ == "__main__":
    main()
