#!/usr/bin/env python3
"""
Yollgo / FreeX Main Paper 6171 Products & Images Automatic Local Pipeline
1. Starts a lightweight local HTTP receiver on port 8999
2. Receives catalog JSON from browser Console via fetch()
3. Automatically saves the 4 database/excel files directly into:
   - /Users/dengyu/CentrodeVender/MainPaper_Full_Images/
   - /Users/dengyu/Downloads/MainPaper_2026_Catalog/
   - /Users/dengyu/github/vueltacole/src/data/
4. Downloads all images concurrently into /Users/dengyu/CentrodeVender/MainPaper_Full_Images/
"""
import os
import sys
import json
import csv
import urllib.request
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
from concurrent.futures import ThreadPoolExecutor

PORT = 8999
IMG_SAVE_DIR = "/Users/dengyu/CentrodeVender/MainPaper_Full_Images"
DOWNLOADS_DIR = "/Users/dengyu/Downloads/MainPaper_2026_Catalog"
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DATA_DIR = os.path.join(REPO_ROOT, "src/data")
PUBLIC_DATA_DIR = os.path.join(REPO_ROOT, "public/data")
SHOP_DATA_DIR = os.path.join(REPO_ROOT, "shop/data")

TARGET_DIRS = [IMG_SAVE_DIR, DOWNLOADS_DIR, SRC_DATA_DIR, PUBLIC_DATA_DIR, SHOP_DATA_DIR]
for d in TARGET_DIRS:
    os.makedirs(d, exist_ok=True)

class SyncReceiver(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        content_len = int(self.headers.get("Content-Length", 0))
        post_body = self.rfile.read(content_len)
        try:
            data = json.loads(post_body.decode("utf-8"))
        except Exception as e:
            self.send_response(400)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(f"Error: {e}".encode("utf-8"))
            return

        no_price = data.get("noPrice", [])
        with_price = data.get("withPrice", [])

        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        resp = {
            "status": "ok",
            "received_count": len(no_price),
            "message": f"成功接收 {len(no_price)} 款商品数据，4个文件已自动落盘，后台图片下载已启动！"
        }
        self.wfile.write(json.dumps(resp, ensure_ascii=False).encode("utf-8"))

        threading.Thread(target=process_and_download, args=(data,)).start()

    def log_message(self, format, *args):
        return

def save_manifest_files(target_dir, no_price, with_price):
    with open(os.path.join(target_dir, "mainpaper_catalog_no_price.json"), "w", encoding="utf-8") as f:
        json.dump(no_price, f, ensure_ascii=False, indent=2)

    with open(os.path.join(target_dir, "mainpaper_catalog_with_price.json"), "w", encoding="utf-8") as f:
        json.dump(with_price, f, ensure_ascii=False, indent=2)

    with open(os.path.join(target_dir, "catalog.json"), "w", encoding="utf-8") as f:
        json.dump(with_price, f, ensure_ascii=False, indent=2)

    with open(os.path.join(target_dir, "mainpaper_catalog_no_price.csv"), "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(['货号(Code)', '条码/客户码', '西语名称', '中文名称', '分类', '小包装(Packet)', '外箱包装(Box)', '新品', '爆款', '高清图片链接'])
        for p in no_price:
            writer.writerow([p.get('code',''), p.get('usercode',''), p.get('namees',''), p.get('namecn',''), p.get('category',''), p.get('packet',1), p.get('box',1), '是' if p.get('isnew') else '否', '是' if p.get('ishot') else '否', p.get('imageUrl','')])

    with open(os.path.join(target_dir, "mainpaper_catalog_with_price.csv"), "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(['货号(Code)', '条码/客户码', '西语名称', '中文名称', '分类', '进货单价(€)', '小包装(Packet)', '小包金额(€)', '外箱包装(Box)', '整箱金额(€)', '新品', '爆款', '高清图片链接'])
        for p in with_price:
            writer.writerow([p.get('code',''), p.get('usercode',''), p.get('namees',''), p.get('namecn',''), p.get('category',''), p.get('price',0), p.get('packet',1), p.get('packetPrice',0), p.get('box',1), p.get('boxPrice',0), '是' if p.get('isnew') else '否', '是' if p.get('ishot') else '否', p.get('imageUrl','')])

def process_and_download(payload):
    no_price = payload.get("noPrice", [])
    with_price = payload.get("withPrice", [])
    total_items = len(no_price)
    new_count = sum(1 for p in no_price if p.get('isnew'))
    print(f"\n=======================================================")
    print(f"📥 成功接收商品清单！总款数: {total_items} (其中标注新品: {new_count} 款)")
    print(f"=======================================================")

    for d in TARGET_DIRS:
        save_manifest_files(d, no_price, with_price)
        print(f"✅ 4个文件（CSV/JSON）已写入: {d}")

    tasks = []
    for p in no_price:
        url = p.get("imageUrl")
        code = p.get("code")
        if url and code and url.startswith("http"):
            tasks.append((code, url))

    total_imgs = len(tasks)
    print(f"\n🖼️ 开始多线程并发下载全部 {total_imgs} 张高清原图...")
    print(f"📁 统一保存目录: {IMG_SAVE_DIR}\n")

    done = 0
    failed = 0
    lock = threading.Lock()

    def download_one(item):
        nonlocal done, failed
        code, url = item
        clean_code = "".join(c for c in code if c.isalnum() or c in ("-", "_", ".")).strip()
        if not clean_code:
            clean_code = "ITEM"
        ext = ".jpg"
        save_path = os.path.join(IMG_SAVE_DIR, f"{clean_code}{ext}")

        if os.path.exists(save_path) and os.path.getsize(save_path) > 1024:
            with lock:
                done += 1
                if done % 100 == 0 or done == total_imgs:
                    print(f"进度: {done}/{total_imgs} (跳过已存在: {clean_code})")
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
                if len(content) > 500:
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
            if done % 100 == 0 or (done + failed) == total_imgs:
                print(f"⏳ 图片下载进度: {done}/{total_imgs} (失败: {failed})")

    with ThreadPoolExecutor(max_workers=20) as executor:
        executor.map(download_one, tasks)

    print(f"\n🎉 全部图片下载完成！成功: {done}, 失败: {failed}")
    print(f"📁 4个文件和全部图片已统一保存在: {IMG_SAVE_DIR}")

def main():
    server = HTTPServer(("127.0.0.1", PORT), SyncReceiver)
    print(f"🚀 本地同步接收器已就绪: http://127.0.0.1:{PORT}")
    sys.stdout.flush()
    server.serve_forever()

if __name__ == "__main__":
    main()
