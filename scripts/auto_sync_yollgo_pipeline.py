#!/usr/bin/env python3
"""
Full Automated Pipeline:
1. Automated Playwright session check & Yollgo extraction
2. Incremental diff against baseline catalog (discovers brand new SKUs)
3. Generates standalone New Products Catalog (Excel with price, Excel no price, JSON, CSV)
4. Normalizes categories & recalculates retail margins (normalize_catalog_data.py)
5. Builds production bundle (build_for_netcup.mjs)
6. Deploys to Netcup & GitHub (git commit & git push)
"""

import os
import sys
import json
import csv
import time
import subprocess
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROFILE_DIR = os.path.join(REPO_ROOT, ".yollgo_session")
CATALOG_PATH = os.path.join(REPO_ROOT, "public/data/catalog.json")
DOWNLOADS_DIR = "/Users/dengyu/Downloads/MainPaper_2026_Catalog"
CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SHOP_ID = "019"

def load_env_file():
    for fname in [".env", "yollgo_login.txt"]:
        env_path = os.path.join(REPO_ROOT, fname)
        if os.path.exists(env_path):
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip("'\"")
                        if k not in os.environ and v:
                            os.environ[k] = v
                    elif line and not line.startswith("#") and ":" in line:
                        k, v = line.split(":", 1)
                        k = k.strip()
                        v = v.strip().strip("'\"")
                        if ("phone" in k.lower() or "手机" in k) and "YOLLGO_PHONE" not in os.environ and v:
                            os.environ["YOLLGO_PHONE"] = v
                        elif ("pass" in k.lower() or "密码" in k) and "YOLLGO_PASSWORD" not in os.environ and v:
                            os.environ["YOLLGO_PASSWORD"] = v

load_env_file()

EXTRACTION_JS = """
async () => {
  const rootEl = document.querySelector('[ng-app]') || document.body;
  if (!window.angular || !angular.element(rootEl).injector()) {
    return { error: 'NO_ANGULAR' };
  }
  const injector = angular.element(rootEl).injector();
  const ps = injector.get('productService');
  const helper = injector.get('helperService');
  const SHOP_ID = '019';

  const catRes = await new Promise(r => ps.category({
    load: false,
    data: { shopid: SHOP_ID },
    success: r,
    error: () => r({ lists: [] })
  }));
  const categories = catRes.lists || [];
  if (categories.length === 0) {
    return { error: 'NOT_LOGGED_IN' };
  }

  // Filter leaf categories (the ones with subid containing the actual products)
  const leafCats = categories.filter(c => c.subid);
  const products = [];
  const seen = new Set();

  for (let i = 0; i < leafCats.length; i++) {
    const cat = leafCats[i];
    const catName = cat.namecn || cat.namees || `分类_${cat.topid}`;

    const prodRes = await new Promise(r => {
      ps.products({
        load: false,
        reload: true,
        cacheextend: cat.category,
        sessionextend: cat.category,
        data: {
          shopid: SHOP_ID,
          topid: String(cat.topid || ''),
          subid: String(cat.subid || '')
        },
        success: r,
        error: () => r({ lists: [] })
      });
    });

    for (const p of (prodRes.lists || [])) {
      const code = p.code || p.bianhao || p.id;
      if (!code || seen.has(code)) continue;
      seen.add(code);

      let imgUrl = '';
      if (p.id && p.hash) {
        imgUrl = `https://img-eu-1.freex.es/img/${SHOP_ID}/${p.id}/1200x1200/${p.hash}`;
      } else if (helper && helper.shopImage) {
        imgUrl = helper.shopImage(SHOP_ID, p, 600, 600, 1200, 1200);
      }

      const packet = parseInt(p.packet || 1);
      const box = parseInt(p.box || 1);
      const price = parseFloat(p.price || p.precio || 0);

      products.push({
        id: p.id || '',
        code: code,
        usercode: p.usercode || '',
        namees: p.namees || '',
        namecn: p.namecn || '',
        category: catName,
        topid: cat.topid || '',
        subid: cat.subid || '',
        packet: packet,
        box: box,
        stock: p.stock !== undefined ? p.stock : 1,
        isnew: Boolean(p.isnew || p.is_new),
        ishot: Boolean(p.ishot || p.is_hot),
        ispromote: Boolean(p.ispromote || p.is_promote),
        imageUrl: imgUrl,
        price: price,
        packetPrice: +(price * packet).toFixed(3),
        boxPrice: +(price * box).toFixed(3)
      });
    }

    if (window.onProgress && (i % 10 === 0 || i === leafCats.length - 1)) {
      await window.onProgress(i + 1, leafCats.length, catName, products.length);
    }
  }

  return { success: true, count: products.length, products: products };
}
"""

def extract_from_yollgo_browser(phone=None, password=None, headless=True):
    from playwright.sync_api import sync_playwright

    phone = phone or os.getenv("YOLLGO_PHONE")
    password = password or os.getenv("YOLLGO_PASSWORD")

    os.makedirs(PROFILE_DIR, exist_ok=True)
    print("🚀 启动自动化 Chrome 浏览器引擎...")

    with sync_playwright() as p:
        context = p.chromium.launch_persistent_context(
            PROFILE_DIR,
            headless=headless,
            executable_path=CHROME_PATH,
            args=["--disable-blink-features=AutomationControlled"]
        )
        page = context.pages[0] if context.pages else context.new_page()
        page.set_default_timeout(300000)

        def on_prog(cur, tot, cat_name, cnt):
            print(f"⏳ 抓取进度: [{cur}/{tot}] {cat_name} (已累计: {cnt} 款)", flush=True)

        page.expose_function("onProgress", on_prog)

        print("🌐 访问 Yollgo 商城类目页...")
        page.goto(f"https://app.yollgo.com/#/home/category/{SHOP_ID}", timeout=30000)
        page.wait_for_timeout(3000)

        # Check if redirected to login
        if "login" in page.url:
            print("⚠️ 检测到需要登录 Yollgo 账号...")
            if phone and password:
                print(f"🔑 正在自动填写账号 {phone} 登录...")
                inputs = page.query_selector_all("input")
                for inp in inputs:
                    itype = inp.get_attribute("type")
                    if itype == "number":
                        inp.fill(phone)
                    elif itype == "password":
                        inp.fill(password)
                
                login_btn = page.query_selector("button:has-text('登录')")
                if login_btn:
                    login_btn.click()
                    page.wait_for_timeout(4000)
                    page.goto(f"https://app.yollgo.com/#/home/category/{SHOP_ID}", timeout=30000)
                    page.wait_for_timeout(3000)
            else:
                context.close()
                return {"error": "NEED_LOGIN", "url": page.url}

        print("⏳ 正在注入 Angular 自动化提取脚本，抓取全部分类商品...")
        result = page.evaluate(EXTRACTION_JS)
        context.close()
        return result

def run_pipeline(phone=None, password=None, headless=True):
    print("\n=======================================================")
    print("🤖 启动 Yollgo 新品全自动同步与发布流水线")
    print("=======================================================\n")

    # 1. Load baseline catalog to discover incremental differences
    baseline_codes = set()
    baseline_usercodes = set()
    if os.path.exists(CATALOG_PATH):
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            base_data = json.load(f)
            for p in base_data:
                if p.get("code"):
                    baseline_codes.add(p["code"])
                if p.get("usercode"):
                    baseline_usercodes.add(p["usercode"])
        print(f"📚 读取到本地现有基准库：共 {len(base_data)} 款商品")

    # 2. Extract from Yollgo
    res = extract_from_yollgo_browser(phone=phone, password=password, headless=headless)
    if not res or res.get("error"):
        err = res.get("error") if res else "Unknown"
        if err == "NEED_LOGIN":
            print("\n❌ 尚未在自动化环境中登录 Yollgo。")
            print("💡 解决办法：请以可见窗口模式运行一次进行登录：")
            print("   ./MediaCrawler/.venv/bin/python scripts/auto_sync_yollgo_pipeline.py --login")
            print("   或者直接传入账号密码：")
            print("   ./MediaCrawler/.venv/bin/python scripts/auto_sync_yollgo_pipeline.py --phone=138... --password=...")
            return False
        print(f"❌ 抓取失败: {err}")
        return False

    raw_products = res.get("products", [])
    total_fetched = len(raw_products)
    if total_fetched < 1000:
        print(f"❌ 抓取到的商品数量过少: {total_fetched} < 1000 款，停止保存以保护现有数据！")
        return False
    print(f"✅ 成功从 Yollgo 抓取到 {total_fetched} 款商品！")

    # 3. Detect Brand New Products (Differential analysis)
    brand_new_items = []
    for p in raw_products:
        code = str(p.get("code") or "").strip()
        uc = str(p.get("usercode") or "").strip()
        text = (str(p.get("namees") or "") + " " + str(p.get("namecn") or "") + " " + uc).upper()
        
        is_diff_new = (code and code not in baseline_codes) and (not uc or uc.upper() not in baseline_usercodes)
        is_season_new = p.get("isnew") or "2027" in text or "2026" in text or "EXM26" in uc.upper() or "NOVEDAD" in text
        if is_diff_new or is_season_new:
            p["isnew"] = True
            brand_new_items.append(p)

    brand_new_items.sort(key=lambda x: str(x.get("usercode") or x.get("code") or ""))

    print(f"\n=======================================================")
    print(f"🔍 智能比对结果：")
    print(f"  • Yollgo 在架商品总数: {total_fetched} 款")
    print(f"  • 本次新上线全新 SKU: {len([p for p in brand_new_items if str(p.get('code')).strip() not in baseline_codes])} 款")
    print(f"  • 累计 2026/2027 新品总数: {len(brand_new_items)} 款")
    print(f"=======================================================\n")

    # 4. Save raw catalogs to local data folders
    target_dirs = [
        os.path.join(REPO_ROOT, "public/data"),
        os.path.join(REPO_ROOT, "src/data"),
        os.path.join(REPO_ROOT, "shop/data"),
        DOWNLOADS_DIR
    ]
    for d in target_dirs:
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, "mainpaper_catalog_with_price.json"), "w", encoding="utf-8") as f:
            json.dump(raw_products, f, ensure_ascii=False, indent=2)
        with open(os.path.join(d, "catalog.json"), "w", encoding="utf-8") as f:
            json.dump(raw_products, f, ensure_ascii=False, indent=2)

    # 5. Export Dedicated New Arrivals Catalogs
    os.makedirs(DOWNLOADS_DIR, exist_ok=True)
    novedades_with_excel = os.path.join(DOWNLOADS_DIR, "novedades_2026_with_price.xlsx")
    novedades_no_excel = os.path.join(DOWNLOADS_DIR, "novedades_2026_no_price.xlsx")
    novedades_csv_no = os.path.join(DOWNLOADS_DIR, "novedades_catalog_no_price.csv")
    novedades_json_pub = os.path.join(REPO_ROOT, "public/data/novedades_catalog.json")

    with open(novedades_json_pub, "w", encoding="utf-8") as f:
        json.dump(brand_new_items, f, ensure_ascii=False, indent=2)

    # Export formatted Excel with prices (strictly NO brackets or parentheses per user rule)
    wb_with = Workbook()
    ws_with = wb_with.active
    ws_with.title = "2026新品进货底表"
    h_font = Font(name="Arial", size=11, bold=True, color="FFFFFF")
    h_fill = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
    headers_with = [
        "序号", "型号货号", "条形码", "西语品名", "中文品名",
        "分类", "进货单价", "建议零售价", "小包装数", "整包金额", "整箱装箱量", "整箱金额", "高清实拍图"
    ]
    ws_with.append(headers_with)
    for col_idx in range(1, len(headers_with) + 1):
        c = ws_with.cell(row=1, column=col_idx)
        c.font = h_font
        c.fill = h_fill
        c.alignment = Alignment(horizontal="center", vertical="center")

    for idx, p in enumerate(brand_new_items, start=1):
        cost = p.get("price", 0)
        pvp = round(cost * 2.8, 2)
        pkt = p.get("packet", 1)
        bx = p.get("box", 1)
        ws_with.append([
            idx, p.get("usercode", ""), p.get("code", ""), p.get("namees", ""), p.get("namecn", ""),
            p.get("category", ""), cost, pvp, pkt, round(cost * pkt, 3), bx, round(cost * bx, 3), p.get("imageUrl", "")
        ])
    wb_with.save(novedades_with_excel)

    # Export formatted Excel without prices (for clients & schools)
    wb_no = Workbook()
    ws_no = wb_no.active
    ws_no.title = "2026新品选品展厅目录"
    h_fill_no = PatternFill(start_color="B45309", end_color="B45309", fill_type="solid")
    headers_no = ["序号", "型号货号", "条形码", "西语品名", "中文品名", "分类", "小包装数", "整箱装箱量", "高清实拍图"]
    ws_no.append(headers_no)
    for col_idx in range(1, len(headers_no) + 1):
        c = ws_no.cell(row=1, column=col_idx)
        c.font = h_font
        c.fill = h_fill_no
        c.alignment = Alignment(horizontal="center", vertical="center")

    for idx, p in enumerate(brand_new_items, start=1):
        ws_no.append([
            idx, p.get("usercode", ""), p.get("code", ""), p.get("namees", ""), p.get("namecn", ""),
            p.get("category", ""), p.get("packet", 1), p.get("box", 1), p.get("imageUrl", "")
        ])
    wb_no.save(novedades_no_excel)

    with open(novedades_csv_no, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(headers_no)
        for idx, p in enumerate(brand_new_items, start=1):
            writer.writerow([
                idx, p.get("usercode", ""), p.get("code", ""), p.get("namees", ""), p.get("namecn", ""),
                p.get("category", ""), p.get("packet", 1), p.get("box", 1), p.get("imageUrl", "")
            ])

    print(f"✅ 独立新品 Catalog 导出成功：\n  • 内部底表: {novedades_with_excel}\n  • 客户展厅表: {novedades_no_excel}")

    # 6. Run Data Normalization
    print("\n⚙️ 正在执行官方 12 大品类归一化与销量排序...")
    py_exec = sys.executable
    subprocess.run([py_exec, os.path.join(REPO_ROOT, "scripts/normalize_catalog_data.py")], check=True)
    subprocess.run([py_exec, os.path.join(REPO_ROOT, "scripts/export_novedades_catalog.py")], check=True)

    # 7. Build production bundle
    print("\n🏗️ 正在自动编译打包生产环境静态资源 (Vite)...")
    subprocess.run(["node", os.path.join(REPO_ROOT, "scripts/build_for_netcup.mjs")], check=True)

    # 8. Git Commit & Push to Netcup
    print("\n🚀 正在推送到 GitHub 与 Netcup 服务器...")
    subprocess.run(["git", "add", "."], check=True)
    subprocess.run(["git", "commit", "-m", f"feat(catalog): auto sync {total_fetched} items and {len(brand_new_items)} new arrivals from Yollgo"], check=True)
    subprocess.run(["git", "push", "origin", "main"], check=True)

    print("\n=======================================================")
    print("🎉 全流程自动化处理完成！")
    print(f"👉 线上商城已同步更新: https://shop.vueltacole.com/")
    print(f"👉 独立新品专区链接: https://shop.vueltacole.com/?filter=isnew")
    print("=======================================================\n")
    return True

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Auto Sync Yollgo Pipeline")
    parser.add_argument("--login", action="store_true", help="Launch interactive browser window to log in to Yollgo once")
    parser.add_argument("--phone", type=str, default=os.getenv("YOLLGO_PHONE"), help="Yollgo Phone Number")
    parser.add_argument("--password", type=str, default=os.getenv("YOLLGO_PASSWORD"), help="Yollgo Password")
    args = parser.parse_args()

    if args.login:
        print("🖥️ 启动可视化浏览器窗口，请在弹出的窗口中登录 Yollgo，登录成功后 Session 将自动永久保存！")
        from playwright.sync_api import sync_playwright
        os.makedirs(PROFILE_DIR, exist_ok=True)
        with sync_playwright() as p:
            ctx = p.chromium.launch_persistent_context(
                PROFILE_DIR,
                headless=False,
                executable_path=CHROME_PATH,
                args=["--disable-blink-features=AutomationControlled"]
            )
            pg = ctx.pages[0] if ctx.pages else ctx.new_page()
            pg.goto(f"https://app.yollgo.com/#/home/category/{SHOP_ID}")
            print("⏳ 窗口已打开，登录完成后请直接关闭窗口或按回车继续...")
            try:
                input("按回车键完成并保存登录状态...")
            except:
                time.sleep(30)
            ctx.close()
        print("✅ 登录状态已成功保存！现在您可以直接运行全自动流水线了。")
        sys.exit(0)

    run_pipeline(phone=args.phone, password=args.password, headless=True)
