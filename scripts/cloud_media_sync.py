#!/usr/bin/env python3
"""
Main Paper · Vueltacole Cloud Media Sync Tool (SOP v2.0)
- Scans ~/Library/CloudStorage/GoogleDrive-mr.dengyu@gmail.com/我的云端硬盘/MainPaper_Cloud_Assets/<campaign>
- Reads the live Google Drive File ID from macOS extended attribute `com.google.drivefs.item-id#S`
- Outputs a zero-bloat JSON manifest with direct Google Drive CDN image URLs & video embed URLs.
"""
import os
import json
import subprocess
import sys

GDRIVE_BASE = os.path.expanduser(
    "~/Library/CloudStorage/GoogleDrive-mr.dengyu@gmail.com/我的云端硬盘/MainPaper_Cloud_Assets"
)


def get_gdrive_id(filepath: str) -> str:
    try:
        out = subprocess.check_output(
            ["xattr", "-p", "com.google.drivefs.item-id#S", filepath],
            stderr=subprocess.DEVNULL,
        )
        return out.decode("utf-8", errors="ignore").strip()
    except Exception:
        return ""


def sync_campaign_folder(campaign_name: str = "Navidad_2026"):
    folder = os.path.join(GDRIVE_BASE, campaign_name)
    if not os.path.exists(folder):
        print(f"Folder not found: {folder}")
        sys.exit(1)

    folder_id = get_gdrive_id(folder)
    manifest = {
        "campaign": campaign_name,
        "gdriveFolderId": folder_id,
        "gdriveFolderUrl": f"https://drive.google.com/drive/folders/{folder_id}" if folder_id else "",
        "images": {},
        "videos": {},
    }

    for fname in sorted(os.listdir(folder)):
        if fname.startswith("."):
            continue
        fpath = os.path.join(folder, fname)
        fid = get_gdrive_id(fpath)
        if not fid:
            continue
        ext = os.path.splitext(fname)[1].lower()
        key = os.path.splitext(fname)[0]
        if ext in (".jpg", ".jpeg", ".png", ".webp"):
            manifest["images"][key] = {
                "fileId": fid,
                "cdnUrl": f"https://lh3.googleusercontent.com/d/{fid}=w1200",
                "thumbUrl": f"https://drive.google.com/thumbnail?id={fid}&sz=w1000",
            }
        elif ext in (".mp4", ".mov"):
            manifest["videos"][key] = {
                "fileId": fid,
                "embedUrl": f"https://drive.google.com/file/d/{fid}/preview",
                "viewUrl": f"https://drive.google.com/file/d/{fid}/view",
            }

    out_json = os.path.join(os.path.dirname(__file__), "..", "src", "data", "cloud_manifest.json")
    os.makedirs(os.path.dirname(out_json), exist_ok=True)
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print(f"Synced {len(manifest['images'])} cloud images and {len(manifest['videos'])} cloud videos -> {out_json}")


if __name__ == "__main__":
    campaign = sys.argv[1] if len(sys.argv) > 1 else "Navidad_2026"
    sync_campaign_folder(campaign)
