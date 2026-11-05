#!/usr/bin/env python3
"""
Upgrade Main Paper Images to 2048x2048 (2K Retina Ultra HD)
1. Updates all 4 files (JSON & CSV) with 2048x2048 links
2. Multi-threaded batch downloader (25 workers) downloading directly into
   /Users/dengyu/CentrodeVender/MainPaper_Full_Images/
"""
import os
import sys
import json
import csv
import urllib.request
import threading
from concurrent.futures import ThreadPoolExecutor

IMG_DIR = "/Users/dengyu/CentrodeVender/MainPaper_Full_Images"
DOWNLOADS_DIR = "/Users/dengyu/Downloads/MainPaper_2026_Catalog"
SRC_DATA_DIR = "/Users/dengyu/github/vueltacole/src/data"

JSON_PATH = os.path.join(IMG_DIR, "mainpaper_catalog_no_price.json")
WITH_JSON_PATH = os.path.join(IMG_DIR, "mainpaper_catalog_with_price.json")

def upgrade_manifests():
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        no_price = json.load(f)
    with open(WITH_JSON_PATH, "r", encoding="utf-8") as f:
        with_price = json.load(f)

    for item in no_price:
        if "/600x600/" in item.get("imageUrl", ""):
            item["imageUrl"] = item["imageUrl"].replace("/600x600/", "/2048x2048/")
    for item in with_price:
        if "/600x600/" in item.get("imageUrl", ""):
            item["imageUrl"] = item["imageUrl"].replace("/600x600/", "/2048x2048/")

    for d in [IMG_DIR, DOWNLOADS_DIR, SRC_DATA_DIR]:
        os.makedirs(d, exist_ok=True)
        # JSON
        with open(os.path.join(d, "mainpaper_catalog_no_price.json"), "w", encoding="utf-8") as f:
            json.dump(no_price, f, ensure_ascii=False, indent=2)
        with open(os.path.join(d, "mainpaper_catalog_with_price.json"), "w", encoding="utf-8") as f:
            json.dump(with_price, f, ensure_ascii=False, indent=2)
        # CSV
        with open(os.path.join(d, "mainpaper_catalog_no_price.csv"), "w", encoding="utf-8-sig", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(['货号(Code)', '条码/客户码', '西语名称', '中文名称', '分类', '小包装(Packet)', '外箱包装(Box)', '新品', '爆款', '2K高清图片链接'])
            for p in no_price:
                writer.writerow([p.get('code',''), p.get('usercode',''), p.get('namees',''), p.get('namecn',''), p.get('category',''), p.get('packet',1), p.get('box',1), '是' if p.get('isnew') else '否', '是' if p.get('ishot') else '否', p.get('imageUrl','')])

        with open(os.path.join(d, "mainpaper_catalog_with_price.csv"), "w", encoding="utf-8-sig", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(['货号(Code)', '条码/客户码', '西语名称', '中文名称', '分类', '进货单价(€)', '小包装(Packet)', '小包金额(€)', '外箱包装(Box)', '整箱金额(€)', '新品', '爆款', '2K高清图片链接'])
            for p in with_price:
                writer.writerow([p.get('code',''), p.get('usercode',''), p.get('namees',''), p.get('namecn',''), p.get('category',''), p.get('price',0), p.get('packet',1), p.get('packetPrice',0), p.get('box',1), p.get('boxPrice',0), '是' if p.get('isnew') else '否', '是' if p.get('ishot') else '否', p.get('imageUrl','')])

    print(f"✅ 4 个数据表已更新为 2048x2048 顶级 2K 画质直链并写入各目录！")
    return no_price

def download_2k_images(items):
    tasks = []
    for p in items:
        url = p.get("imageUrl", "")
        code = p.get("code", "")
        if url and code and url.startswith("http"):
            tasks.append((code, url))

    total = len(tasks)
    print(f"🚀 开始全量多线程下载 2048x2048 (2K 视网膜超高清) 实物大图，总共: {total} 张...")
    print(f"📁 保存目录: {IMG_DIR}\n")

    done = 0
    failed = 0
    skipped = 0
    lock = threading.Lock()

    def download_one(task):
        nonlocal done, failed, skipped
        code, url = task
        clean_code = "".join(c for c in code if c.isalnum() or c in ("-", "_", ".")).strip() or "ITEM"
        save_path = os.path.join(IMG_DIR, f"{clean_code}.jpg")

        # 检查是否已经是 2K 大图 (如果文件大小大于 70KB，说明已经是高画质版)
        if os.path.exists(save_path) and os.path.getsize(save_path) > 70000:
            with lock:
                skipped += 1
                done += 1
                if done % 100 == 0 or done == total:
                    print(f"进度: {done}/{total} (已是2K原图: {skipped})")
            return

        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://app.yollgo.com/"
        }
        req = urllib.request.Request(url, headers=headers)
        success = False
        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
                content = resp.read()
                # 只有真正的大图（>10KB）才写入，避免 42 字节的错误 JSON
                if len(content) > 10000:
                    with open(save_path, "wb") as f_out:
                        f_out.write(content)
                    success = True
        except Exception:
            pass

        with lock:
            if success:
                done += 1
            else:
                failed += 1
            if done % 100 == 0 or (done + failed) == total:
                print(f"⏳ 2K 图片下载进度: {done}/{total} (失败: {failed})")

    with ThreadPoolExecutor(max_workers=25) as executor:
        executor.map(download_one, tasks)

    print(f"\n🎉 2048x2048 (2K 视网膜超清图) 全部更新完毕！成功: {done}, 失败: {failed}")

if __name__ == "__main__":
    items = upgrade_manifests()
    download_2k_images(items)
