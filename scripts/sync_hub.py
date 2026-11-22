#!/usr/bin/env python3
"""Copy the profile hub's generated data into this website, so both surfaces show one set of numbers.

    python scripts/sync_hub.py            # from the hub checkout next to this one (../hienta16), or $CATWALK_HUB
    python scripts/sync_hub.py --remote   # download from the public hub on GitHub (raw.githubusercontent.com)
    python scripts/sync_hub.py --soft     # never fail: keep the files already here (runs before `npm run dev`)

The hub (github.com/hienta16/hienta16) is where Python fetches the GitHub stats, runs the cat's toy box and draws
the isometric calendar. This script only copies and checks its output; it never calls the GitHub API.
Files land in src/data/hub/ and are committed, so the site always builds, even offline.
When the hub is public, the site also reads github.json and toys.json live at runtime (src/lib/hub.ts).
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.request
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
OUT = SITE / "src" / "data" / "hub"
HUB_REPO = "hienta16/hienta16"

# (path in the hub, file name here, required)
FILES = [
    ("config/catwalk.json", "catwalk.json", True),
    ("config/toys.json", "toys-config.json", True),
    ("data/github.json", "github.json", True),
    ("data/toys.json", "toys.json", True),
    ("data/toys.demo.json", "toys-demo.json", False),
    ("assets/generated/iso-site.svg", "iso.svg", True),
    ("assets/generated/iso-site-compact.svg", "iso-compact.svg", True),
]


def check(name: str, text: str) -> str:
    """Refuse anything that is not what the hub writes. Returns the text to store."""
    if name.endswith(".svg"):
        if not text.lstrip().startswith("<svg") or "<script" in text.lower():
            raise ValueError(f"{name} is not a plain SVG")
        return text
    data = json.loads(text)
    if name == "github.json" and (data.get("schema") != 2 or not data.get("calendar")):
        raise ValueError("github.json is not a schema 2 snapshot with a calendar")
    if name in ("toys.json", "toys-demo.json"):
        if data.get("schema") != 1:
            raise ValueError(f"{name} is not schema 1 toy state")
        data.pop("ledger", None)  # the website needs the toys, not the processing log
        return json.dumps(data, indent=2, ensure_ascii=False) + "\n"
    return text


def read_local(hub: Path, path: str) -> str | None:
    f = hub / path
    return f.read_text(encoding="utf-8") if f.exists() else None


def read_remote(path: str) -> str | None:
    url = f"https://raw.githubusercontent.com/{HUB_REPO}/main/{path}"
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "hienta16-site-sync"}), timeout=20) as r:  # noqa: S310
            return r.read().decode("utf-8")
    except OSError:
        return None


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--hub", default=os.environ.get("CATWALK_HUB", str(SITE.parent / "hienta16")))
    ap.add_argument("--remote", action="store_true")
    ap.add_argument("--soft", action="store_true")
    args = ap.parse_args()
    hub = Path(args.hub)
    if not args.remote and not hub.is_dir():
        msg = f"no hub checkout at {hub} (set CATWALK_HUB or use --remote)"
        print(("! " if args.soft else "x ") + msg + ("; keeping the bundled data" if args.soft else ""))
        return 0 if args.soft else 1

    staged: dict[str, str] = {}
    for src, name, required in FILES:
        text = read_remote(src) if args.remote else read_local(hub, src)
        if text is None:
            if required:
                print(f"{'! ' if args.soft else 'x '}missing {src}")
                if not args.soft:
                    return 1
            continue
        try:
            staged[name] = check(name, text)
        except (ValueError, json.JSONDecodeError) as exc:
            print(f"{'! ' if args.soft else 'x '}{src}: {exc}")
            if not args.soft:
                return 1
    OUT.mkdir(parents=True, exist_ok=True)
    for name, text in staged.items():
        target = OUT / name
        if not target.exists() or target.read_text(encoding="utf-8") != text:
            target.write_text(text, encoding="utf-8", newline="\n")
            print(f"updated src/data/hub/{name}")
    print(f"hub data in sync ({len(staged)} files from {'GitHub' if args.remote else hub})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
