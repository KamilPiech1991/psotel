#!/usr/bin/env python3
"""
Auto Blog Publisher for AP Dent Piaseczno
Generates SEO-optimized dental blog posts using Claude API and publishes to WordPress.

Usage:
    python3 auto_blog.py              # Publish next post from topics.json
    python3 auto_blog.py --dry-run    # Generate post but don't publish
    python3 auto_blog.py --preview    # Show which topic is next without generating

Requires .env file with:
    WP_URL=https://apdentpiaseczno.pl
    WP_USER=your_username
    WP_PASSWORD=your_app_password
    ANTHROPIC_API_KEY=sk-ant-...
"""

import json
import os
import sys
import argparse
import logging
from datetime import datetime
from pathlib import Path

import anthropic
import requests

# --- Config ---
SCRIPT_DIR = Path(__file__).parent
TOPICS_FILE = SCRIPT_DIR / "topics.json"
STATE_FILE = SCRIPT_DIR / "state.json"
LOG_FILE = SCRIPT_DIR / "auto_blog.log"
ENV_FILE = Path.home() / ".env"

CLAUDE_MODEL = "claude-sonnet-4-20250514"
MAX_TOKENS = 4096

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
    """Load environment variables from ~/.env file."""
    if ENV_FILE.exists():
        for line in ENV_FILE.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                os.environ.setdefault(key.strip(), value.strip())

    required = ["WP_URL", "WP_USER", "WP_PASSWORD", "ANTHROPIC_API_KEY"]
    missing = [k for k in required if not os.environ.get(k)]
    if missing:
        log.error(f"Missing environment variables: {', '.join(missing)}")
        log.error(f"Add them to {ENV_FILE}")
        sys.exit(1)


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


def generate_post(topic):
    """Generate a blog post using Claude API."""
    client = anthropic.Anthropic()

    prompt = f"""Napisz artykuł blogowy dla kliniki stomatologicznej AP Dent w Piasecznie.

TEMAT: {topic['title_hint']}
FRAZA KLUCZOWA: {topic['keyword']}
KĄT ARTYKUŁU: {topic['angle']}

WYMAGANIA:
1. Artykuł 1200-1800 słów, w języku polskim
2. Struktura: wstęp, 4-6 sekcji z nagłówkami H2/H3, podsumowanie
3. Naturalnie wpleć frazę kluczową "{topic['keyword']}" 5-8 razy (w nagłówkach, pierwszym akapicie, podsumowaniu)
4. Dodaj na końcu sekcję FAQ z 3-4 pytaniami zoptymalizowanymi pod "{topic['keyword']}"
5. Ton: profesjonalny ale przystępny, empatyczny wobec pacjentów
6. Wspominaj o AP Dent Piaseczno (ul. Pelikanów 2D) naturalnie, nie nachalnie
7. Godziny: pon-pt 8:00-20:00, sob 8:00-14:00, tel. 22 702 54 70

ZWRÓĆ odpowiedź w formacie JSON:
{{
    "title": "Tytuł artykułu (max 70 znaków)",
    "meta_description": "Meta description (max 155 znaków, z frazą kluczową)",
    "content_html": "Pełna treść artykułu w HTML (h2, h3, p, ul, li, strong)",
    "faq_schema": [
        {{"question": "Pytanie 1", "answer": "Odpowiedź 1"}},
        {{"question": "Pytanie 2", "answer": "Odpowiedź 2"}}
    ],
    "slug": "slug-artykulu-po-polsku"
}}

WAŻNE: Zwróć TYLKO JSON, bez żadnego tekstu przed ani po."""

    log.info(f"Generating post for: {topic['keyword']}")

    response = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=MAX_TOKENS,
        messages=[{"role": "user", "content": prompt}],
    )

    text = response.content[0].text.strip()

    # Extract JSON if wrapped in code block
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
        text = text.strip()

    return json.loads(text)


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


def publish_to_wordpress(post_data):
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
        "status": "draft",  # Publish as draft for review
    }

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

    if args.dry_run:
        # Save to file for review
        output_file = SCRIPT_DIR / f"draft_{post_data['slug']}.json"
        output_file.write_text(json.dumps(post_data, ensure_ascii=False, indent=2))
        log.info(f"Dry run - saved to {output_file}")
        return

    # Publish
    if args.publish:
        # Override status to publish immediately
        pass

    post_id = publish_to_wordpress(post_data)

    if post_id:
        # Update state
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
