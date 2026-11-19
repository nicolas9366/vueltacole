#!/usr/bin/env python3
"""
Telegram Channel & VIP Group Auto-Publisher for MP* Flagship SKUs.
Reads flagship items from src/data/dailyVitrinaDB.ts and sends a clean
multi-photo album (sendMediaGroup) + inline showcase/WhatsApp CTA to Telegram.

Usage:
  TELEGRAM_BOT_TOKEN=xxx TELEGRAM_CHAT_ID=@your_channel python3 scripts/telegram_publish.py --sku PE461 --lang es
  TELEGRAM_BOT_TOKEN=xxx TELEGRAM_CHAT_ID=@your_channel python3 scripts/telegram_publish.py --list
"""
import argparse
import json
import os
import re
import sys
import urllib.request
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "dailyVitrinaDB.ts"
SHOWCASE_BASE = "https://vueltacole.com/showcase.html"
WHATSAPP_URL = "https://wa.me/34604229098"


def parse_flagship_skus() -> dict:
    text = DB_PATH.read_text(encoding="utf-8")
    skus = {}
    # Find each block by sku: '...' or "sku": "..."
    matches = list(re.finditer(r'["\']?sku["\']?\s*:\s*["\']([^"\']+)["\']', text))
    for i, m in enumerate(matches):
        sku = m.group(1)
        start = max(0, m.start() - 120)
        end = matches[i + 1].start() - 120 if i + 1 < len(matches) else len(text)
        chunk = text[start:end]

        def field(name):
            fm = re.search(rf'["\']?{name}["\']?\s*:\s*["\']([^"\']+)["\']', chunk)
            return fm.group(1) if fm else ""

        imgs = []
        for im in re.finditer(r'gdImg\(["\']([^"\']+)["\']\)|https://lh3\.googleusercontent\.com/d/([^="\']+)=w1200', chunk):
            fid = im.group(1) or im.group(2)
            url = f"https://lh3.googleusercontent.com/d/{fid}=w1200"
            if url not in imgs:
                imgs.append(url)

        skus[sku] = {
            "sku": sku,
            "titleZh": field("titleZh"),
            "titleEn": field("titleEn"),
            "titleEs": field("titleEs"),
            "taglineZh": field("taglineZh"),
            "taglineEn": field("taglineEn"),
            "taglineEs": field("taglineEs"),
            "shareTextZh": field("shareTextZh"),
            "shareTextEn": field("shareTextEn"),
            "shareTextEs": field("shareTextEs"),
            "images": imgs[:6],
        }
    return skus


def tg_api(token: str, method: str, payload: dict) -> dict:
    url = f"https://api.telegram.org/bot{token}/{method}"
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def build_caption(item: dict, lang: str) -> str:
    short_sku = item["sku"].split("/")[0].strip()
    if lang == "zh":
        return (
            f"✨ <b>{item['titleZh'] or short_sku}</b>\n"
            f"型号：<code>{short_sku}</code>\n\n"
            f"{item['shareTextZh'] or item['taglineZh']}\n\n"
            f"#文具选品 #西班牙批发 #MP文具 #{short_sku.replace('-', '')}"
        )
    if lang == "en":
        return (
            f"✨ <b>{item['titleEn'] or short_sku}</b>\n"
            f"SKU: <code>{short_sku}</code>\n\n"
            f"{item['shareTextEn'] or item['taglineEn']}\n\n"
            f"#Stationery #WholesaleEurope #MPStyle #{short_sku.replace('-', '')}"
        )
    return (
        f"✨ <b>{item['titleEs'] or short_sku}</b>\n"
        f"Ref.: <code>{short_sku}</code>\n\n"
        f"{item['shareTextEs'] or item['taglineEs']}\n\n"
        f"#Papeleria #VueltaAlCole #MPStyle #{short_sku.replace('-', '')}"
    )


def publish_sku(item: dict, lang: str, token: str, chat_id: str, dry_run: bool = False):
    short_sku = item["sku"].split("/")[0].strip()
    caption = build_caption(item, lang)
    images = item["images"][:6]
    if not images:
        raise RuntimeError(f"No images found for {item['sku']}")

    media = []
    for idx, img_url in enumerate(images):
        entry = {"type": "photo", "media": img_url}
        if idx == 0:
            entry["caption"] = caption
            entry["parse_mode"] = "HTML"
        media.append(entry)

    cta_labels = {
        "zh": ("查看完整展厅与视频", "WhatsApp 询价对接"),
        "en": ("View Full Gallery & Videos", "Wholesale WhatsApp"),
        "es": ("Ver Galería y Vídeos", "Consultar por WhatsApp"),
    }[lang]

    reply_markup = {
        "inline_keyboard": [
            [
                {"text": cta_labels[0], "url": f"{SHOWCASE_BASE}?sku={short_sku}"},
                {"text": cta_labels[1], "url": WHATSAPP_URL},
            ]
        ]
    }

    if dry_run:
        print("=== DRY RUN PAYLOAD ===")
        print("Chat:", chat_id)
        print("Photos:", len(media))
        print("Caption:\n", caption)
        return

    res1 = tg_api(token, "sendMediaGroup", {"chat_id": chat_id, "media": media})
    print("MediaGroup sent:", res1.get("ok"), "count:", len(media))
    res2 = tg_api(
        token,
        "sendMessage",
        {
            "chat_id": chat_id,
            "text": f"📌 <b>{short_sku}</b>",
            "parse_mode": "HTML",
            "reply_markup": reply_markup,
        },
    )
    print("CTA buttons sent:", res2.get("ok"))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--list", action="store_true", help="List available flagship SKUs")
    parser.add_argument("--sku", help="SKU to publish (e.g. PE461)")
    parser.add_argument("--lang", choices=["zh", "en", "es"], default="es")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    skus = parse_flagship_skus()
    if args.list or not args.sku:
        print(f"Available flagship SKUs ({len(skus)}):")
        for k, v in sorted(skus.items()):
            print(f"  {k:28s} | {len(v['images'])} imgs | {v['titleZh']}")
        return

    match = None
    for k, v in skus.items():
        if k.lower() == args.sku.lower() or k.split("/")[0].strip().lower() == args.sku.lower():
            match = v
            break
    if not match:
        print(f"SKU not found: {args.sku}", file=sys.stderr)
        sys.exit(1)

    token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID", "")
    if not args.dry_run and (not token or not chat_id):
        print("Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables first.", file=sys.stderr)
        sys.exit(1)

    publish_sku(match, args.lang, token, chat_id, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
