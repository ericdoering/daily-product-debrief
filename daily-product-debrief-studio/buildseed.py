#!/usr/bin/env python3
"""
Build Sanity NDJSON from Slack canvas exports of the Daily Product Debrief.

Input:  /home/claude/canvas/YYYY-MM-DD-debrief.md
        /home/claude/canvas/YYYY-MM-DD-deepdive.md
Output: /home/claude/out/seed.ndjson

_ids are deterministic, so `sanity dataset import seed.ndjson production --replace`
updates in place rather than creating duplicates on a re-run.
"""
import json
import re
from pathlib import Path

CANVAS_DIR = Path("/home/claude/canvas")
OUT = Path("/home/claude/out/seed.ndjson")

TYPES = {
    "debrief": ("morningDebrief", "Morning Debrief"),
    "deepdive": ("sanityDeepDive", "Sanity Deep Dive"),
}


def clean(md: str) -> str:
    """Slack canvases use non-breaking spaces for code indentation, and Slack
    emoji shortcodes in place of the unicode characters the source used."""
    md = md.replace("\u00a0", " ")
    md = re.sub(r"[ \t]+$", "", md, flags=re.M)
    return md.strip() + "\n"


def main():
    docs = []
    for path in sorted(CANVAS_DIR.glob("*.md")):
        m = re.match(r"^(\d{4}-\d{2}-\d{2})-(debrief|deepdive)\.md$", path.name)
        if not m:
            print(f"  skipped (unexpected name): {path.name}")
            continue
        date, kind = m.group(1), m.group(2)
        type_name, title = TYPES[kind]
        docs.append(
            {
                "_id": f"{type_name}-{date}",
                "_type": type_name,
                "title": title,
                "date": date,
                "body": clean(path.read_text()),
            }
        )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w") as f:
        for d in docs:
            f.write(json.dumps(d, ensure_ascii=False) + "\n")

    by_date = {}
    for d in docs:
        by_date.setdefault(d["date"], set()).add(d["_type"])

    print(f"Wrote {len(docs)} documents to {OUT}\n")
    for date in sorted(by_date, reverse=True):
        kinds = by_date[date]
        missing = {"morningDebrief", "sanityDeepDive"} - kinds
        flag = "ok " if not missing else "!  "
        note = "" if not missing else f"  (missing {', '.join(sorted(missing))})"
        print(f"  {flag}{date}{note}")

    short = [d["_id"] for d in docs if len(d["body"]) < 500]
    if short:
        print("\n  Suspiciously short bodies, check these:")
        for s in short:
            print(f"    - {s}")


if __name__ == "__main__":
    main()