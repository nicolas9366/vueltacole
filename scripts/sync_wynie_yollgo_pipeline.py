#!/usr/bin/env python3
"""
Wynie Cosmetics (Yollgo Shop 235) Automated Catalog Extraction Pipeline
Fetches full categories and products for Wynie, saves clean JSON and Excel spreadsheets.
"""

import os
import sys
import json
import time
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from playwright.sync_api import sync_playwright

SHOP_ID = "235"
OUTPUT_DIR = "/Users/dengyu/Downloads/Wynie_2026_Catalog"
os.makedirs(OUTPUT_DIR, exist_ok=True)

CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

EXTRACTION_JS = """
async () => {
  const rootEl = document.querySelector('[ng-app]') || document.body;
  if (!window.angular || !angular.element(rootEl).injector()) {
    return { error: 'NO_ANGULAR' };
  }
  const injector = angular.element(rootEl).injector();
  const ps = injector.get('productService');
  const SHOP_ID = '235';

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

  // Find which topids have subcategories
  const topWithSub = new Set();
  categories.forEach(c => {
    if (c.subid) topWithSub.add(c.topid);
  });

  // Accurate leaf categories
  const leafCats = categories.filter(c => {
    if (c.subid) return true;
    return !topWithSub.has(c.topid);
  });

  const products = [];
  const seen = new Set();

  for (let i = 0; i < leafCats.length; i++) {
    const cat = leafCats[i];
    const catName = cat.namecn || cat.namees || `分类_${cat.topid}`;
    const catKey = cat.category || (cat.topid + (cat.subid ? '_' + cat.subid : ''));

    const prodRes = await new Promise(r => {
      ps.products({
        load: false,
        reload: true,
        cacheextend: catKey,
        sessionextend: catKey,
        data: {
          shopid: SHOP_ID,
          topid: String(cat.topid || ''),
          subid: String(cat.subid || '')
        },
        success: r,
        error: () => r({ lists: [] })
      });
    });

    const items = prodRes.lists || [];
    for (const p of items) {
      const code = p.code || p.bianhao || p.id;
      if (!code || seen.has(code)) continue;
      seen.add(code);

      let imgUrl = '';
      if (p.id && p.hash) {
        imgUrl = `https://img-eu-1.freex.es/img/${SHOP_ID}/${p.id}/1024x1024/${p.hash}`;
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
        topid: String(cat.topid || ''),
        subid: String(cat.subid || ''),
        category: catName,
        price: price,
        packet: packet,
        packetPrice: Math.round(price * packet * 1000) / 1000,
        box: box,
        boxPrice: Math.round(price * box * 1000) / 1000,
        isnew: Boolean(p.isnew),
        ishot: Boolean(p.ishot),
        ispromote: Boolean(p.ispromote),
        imageUrl: imgUrl
      });
    }

    if (window.onProgress) {
      window.onProgress(i + 1, leafCats.length, catName, products.length);
    }
    // Polite delay between category requests
    await new Promise(r => setTimeout(r, 60));
  }

  return {
    shopid: SHOP_ID,
    categoriesCount: categories.length,
    leafCount: leafCats.length,
    productsCount: products.length,
    products: products
  };
};
"""

def extract_wynie():
    print("=======================================================")
    print("💄 启动 Wynie (Yollgo 235商铺) 自动化商品同步流水线")
    print("=======================================================\n")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            executable_path=CHROME_PATH,
            args=["--disable-blink-features=AutomationControlled"]
        )
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()
        page.set_default_timeout(600000)
        
        def on_prog(cur, tot, cat_name, cnt):
            print(f"⏳ 抓取进度: [{cur}/{tot}] {cat_name} · 已采集 {cnt} 款商品", flush=True)

        page.expose_function("onProgress", on_prog)
        
        print("🔑 正在登录 Yollgo 官方系统...")
        page.goto("https://app.yollgo.com/#/account/login", wait_until="networkidle")
        time.sleep(2)
        
        inputs = page.query_selector_all("input")
        for inp in inputs:
            itype = inp.get_attribute("type")
            if itype == "number":
                inp.fill("604229098")
            elif itype == "password":
                inp.fill("fetion098")
                
        btn = page.query_selector("button:has-text('登录')")
        if btn:
            btn.click()
            time.sleep(3)
            
        print("🌐 访问 Wynie 商铺主页: https://app.yollgo.com/#/home/category/235")
        page.goto("https://app.yollgo.com/#/home/category/235", wait_until="networkidle")
        time.sleep(3)
        
        print("⏳ 正在执行批量数据抓取，请稍候...")
        res = page.evaluate(EXTRACTION_JS)
        browser.close()
        
        if not res or res.get("error"):
            print("❌ 抓取失败:", res)
            return False
            
        products = res.get("products", [])
        total = len(products)
        new_cnt = sum(1 for p in products if p.get("isnew"))
        print(f"\n🎉 抓取成功！Wynie 235 商铺共获取 {total} 款商品 (其中新品 {new_cnt} 款)")
        
        # Save JSON
        json_path = os.path.join(OUTPUT_DIR, "wynie_catalog.json")
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        print(f"📁 已保存全量 JSON 数据: {json_path}")
        
        # Save Excel with price
        wb_price = Workbook()
        ws_price = wb_price.active
        ws_price.title = "Wynie 全系批发价格表"
        ws_price.views.sheetView[0].showGridLines = True
        
        headers_price = [
            "条码", "货号", "西语名称", "中文名称", "所属类目",
            "批发单价 €", "小包装数", "小包金额 €", "外箱包装数", "外箱金额 €",
            "是否新品", "是否爆款", "是否促销", "高清图片链接"
        ]
        ws_price.append(headers_price)
        
        # Styling
        header_fill = PatternFill(start_color="111111", end_color="111111", fill_type="solid")
        header_font = Font(name="Arial", size=11, bold=True, color="C09A61")
        border_thin = Border(
            left=Side(style='thin', color='DDDDDD'),
            right=Side(style='thin', color='DDDDDD'),
            top=Side(style='thin', color='DDDDDD'),
            bottom=Side(style='thin', color='DDDDDD')
        )
        
        for col_idx in range(1, len(headers_price) + 1):
            cell = ws_price.cell(row=1, column=col_idx)
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
            
        for p in products:
            ws_price.append([
                p.get("code", ""),
                p.get("usercode", ""),
                p.get("namees", ""),
                p.get("namecn", ""),
                p.get("category", ""),
                p.get("price", 0),
                p.get("packet", 1),
                p.get("packetPrice", 0),
                p.get("box", 1),
                p.get("boxPrice", 0),
                "是" if p.get("isnew") else "否",
                "是" if p.get("ishot") else "否",
                "是" if p.get("ispromote") else "否",
                p.get("imageUrl", "")
            ])
            
        for row in ws_price.iter_rows(min_row=2, max_row=len(products)+1, min_col=1, max_col=len(headers_price)):
            for cell in row:
                cell.border = border_thin
                
        excel_price_path = os.path.join(OUTPUT_DIR, "wynie_catalog_with_price.xlsx")
        wb_price.save(excel_price_path)
        print(f"📊 已生成批发进货底表: {excel_price_path}")
        
        # Save Excel no price
        wb_noprice = Workbook()
        ws_noprice = wb_noprice.active
        ws_noprice.title = "Wynie 对外选品表"
        ws_noprice.views.sheetView[0].showGridLines = True
        
        headers_noprice = [
            "条码", "货号", "西语名称", "中文名称", "所属类目",
            "小包装数", "外箱包装数", "是否新品", "是否爆款", "是否促销", "高清图片链接"
        ]
        ws_noprice.append(headers_noprice)
        for col_idx in range(1, len(headers_noprice) + 1):
            cell = ws_noprice.cell(row=1, column=col_idx)
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
            
        for p in products:
            ws_noprice.append([
                p.get("code", ""),
                p.get("usercode", ""),
                p.get("namees", ""),
                p.get("namecn", ""),
                p.get("category", ""),
                p.get("packet", 1),
                p.get("box", 1),
                "是" if p.get("isnew") else "否",
                "是" if p.get("ishot") else "否",
                "是" if p.get("ispromote") else "否",
                p.get("imageUrl", "")
            ])
            
        for row in ws_noprice.iter_rows(min_row=2, max_row=len(products)+1, min_col=1, max_col=len(headers_noprice)):
            for cell in row:
                cell.border = border_thin
                
        excel_noprice_path = os.path.join(OUTPUT_DIR, "wynie_catalog_no_price.xlsx")
        wb_noprice.save(excel_noprice_path)
        print(f"🏛️ 已生成客户对外展示表: {excel_noprice_path}")
        
        return True

if __name__ == '__main__':
    extract_wynie()
