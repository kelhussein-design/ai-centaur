"""
The AI Centaur — automatic news refresh
Runs inside GitHub Actions on a schedule (or when you press "Run workflow").
Asks Claude to web-search for current AI news, validates the result strictly,
and only writes src/data/news.json + src/data/meta.json if everything checks out.
If anything looks wrong, it exits with an error and the site is left untouched.
"""

import json
import os
import re
import sys
import urllib.request
from datetime import date, datetime

MODEL = "claude-sonnet-4-6"  # if this model is ever retired, update this one line
MAX_SEARCHES = 15            # hard cap on web searches per run (cost guard: ~15 cents)
NEWS_PATH = "src/data/news.json"
META_PATH = "src/data/meta.json"

TOPICS = [
    "0 = Misalignment & AI safety",
    "1 = Who controls AI / power & governance",
    "2 = Security, hacking & misuse",
    "3 = Information integrity, deepfakes & elections",
    "4 = Jobs & the economy",
    "5 = Creativity & the arts",
    "6 = Education & kids",
    "7 = Environment & energy",
    "8 = Reliability, hallucinations & trust",
]

PROMPT = f"""You are the researcher for "The AI Centaur", a civic AI-literacy site whose motto is
"verified facts over vibes". Your job: use web search to find current, real AI news and
output a JSON array for the site's news page.

Today's date: {date.today().strftime('%B %d, %Y')}.

Requirements — every one of these is mandatory:
1. Output EXACTLY 12 news items as a JSON array, and NOTHING else — no prose, no markdown fences.
2. Each item is an object with exactly these keys:
   - "headline": plain-English, specific, under 90 characters, no clickbait
   - "date": like "Aug 2026" (month + year the story is from)
   - "source": short outlet or institution name, e.g. "Reuters", "IEA", "Stanford"
   - "topic": an integer 0-8 using this map: {'; '.join(TOPICS)}
   - "url": the REAL, full URL of a page you actually found via web search
3. URLs must come from your search results. NEVER invent, guess, or reconstruct a URL.
   Prefer primary sources (the institution, the paper, the government page, the major
   outlet that broke the story) over blogs and aggregators.
4. At least 8 of the 12 items must be from the last 60 days. Older items are allowed only
   if they are landmark reports still shaping the debate.
5. Cover at least 6 different topic numbers. Do not let one topic dominate.
6. Balance matters: include both concerning developments and genuine progress. The site
   is neither a doom feed nor a hype feed.
7. Headlines must accurately reflect what the linked page says. If you are not sure a
   story is real, leave it out and find another.

Search efficiently — you have a budget of {MAX_SEARCHES} searches. Good queries: "AI news this week",
"AI regulation news", "AI education schools news", "AI energy data center news", "AI jobs
report", "deepfake election news", "AI safety report".

Final output: the raw JSON array only."""


def call_claude(api_key: str) -> str:
    body = {
        "model": MODEL,
        "max_tokens": 4000,
        "messages": [{"role": "user", "content": PROMPT}],
        "tools": [{
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": MAX_SEARCHES,
        }],
    }
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=json.dumps(body).encode(),
        headers={
            "content-type": "application/json",
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
        },
    )
    with urllib.request.urlopen(req, timeout=600) as resp:
        data = json.loads(resp.read())
    # Concatenate all text blocks (search tool blocks are interleaved)
    return "\n".join(b.get("text", "") for b in data.get("content", []) if b.get("type") == "text")


def extract_json_array(text: str):
    """Find the last complete JSON array in the model's output."""
    text = re.sub(r"```(?:json)?", "", text)
    start = text.find("[")
    end = text.rfind("]")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("No JSON array found in model output")
    return json.loads(text[start:end + 1])


def validate(items) -> list:
    if not isinstance(items, list):
        raise ValueError("Output is not a list")
    if not (10 <= len(items) <= 14):
        raise ValueError(f"Expected ~12 items, got {len(items)}")
    seen_urls = set()
    for i, it in enumerate(items):
        for key in ("headline", "date", "source", "topic", "url"):
            if key not in it:
                raise ValueError(f"Item {i} missing key: {key}")
        if not isinstance(it["topic"], int) or not (0 <= it["topic"] <= 8):
            raise ValueError(f"Item {i} has bad topic: {it['topic']!r}")
        url = str(it["url"]).strip()
        if not url.startswith("http") or url == "#" or len(url) < 12:
            raise ValueError(f"Item {i} has bad url: {url!r}")
        if url in seen_urls:
            raise ValueError(f"Duplicate url: {url}")
        seen_urls.add(url)
        if not (5 <= len(str(it["headline"])) <= 120):
            raise ValueError(f"Item {i} headline length out of range")
        # Keep only the expected keys, in a stable order
        items[i] = {k: it[k] for k in ("headline", "date", "source", "topic", "url")}
    if len({it["topic"] for it in items}) < 5:
        raise ValueError("Too few distinct topics covered")
    return items


def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if not api_key:
        sys.exit("ANTHROPIC_API_KEY is not set — add it in GitHub → Settings → Secrets → Actions")

    print(f"Asking {MODEL} for fresh news (max {MAX_SEARCHES} searches)...")
    raw = call_claude(api_key)
    items = validate(extract_json_array(raw))
    print(f"Validated {len(items)} items across {len({i['topic'] for i in items})} topics.")

    with open(NEWS_PATH, "w") as f:
        json.dump(items, f, indent=2)
        f.write("\n")

    today = date.today()
    meta = {
        "lastUpdated": today.strftime("%B %-d, %Y") if os.name != "nt" else today.strftime("%B %d, %Y"),
        "lastNewsRefresh": today.isoformat(),
        "refreshedBy": f"GitHub Action · {MODEL}",
        "refreshedAtUTC": datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
    }
    with open(META_PATH, "w") as f:
        json.dump(meta, f, indent=2)
        f.write("\n")

    print("Wrote", NEWS_PATH, "and", META_PATH)
    for it in items:
        print(f"  [{it['topic']}] {it['headline']}  — {it['source']}")


if __name__ == "__main__":
    main()
