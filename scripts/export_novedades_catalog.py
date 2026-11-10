#!/usr/bin/env python3
"""
Detect and Export Dedicated Novedades (New Arrivals) Catalog:
1. Identifies new products based on:
   - Incremental diff (new SKUs vs baseline)
   - Yollgo isnew flag
   - 2026/2027 newly launched lines (Agendas, Calendarios, etc.)
2. Exports standalone catalog files:
   - novedades_catalog.json (for web and API)
   - novedades_catalog.csv (for quick view)
   - novedades_2026_with_price.xlsx (internal cost/wholesale Excel)
   - novedades_2026_no_price.xlsx (external wholesale presentation Excel)
"""

import os
import json
import csv
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_PATH = os.path.join(REPO_ROOT, 'public/data/catalog.json')
DOWNLOADS_DIR = '/Users/dengyu/Downloads/MainPaper_2026_Catalog'

def is_new_product(p):
    if p.get('isnew'):
        return True
    if p.get('masterId') == '01':
        return True
    text = (p.get('namees', '') + ' ' + p.get('usercode', '') + ' ' + p.get('category', '')).lower()
    if '2027' in text or '2026/2027' in text:
        return True
    return False

def main():
    if not os.path.exists(CATALOG_PATH):
        print(f"❌ 找不到数据文件: {CATALOG_PATH}")
        return

    with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
        catalog = json.load(f)

    # Filter new products
    novedades = [p for p in catalog if is_new_product(p)]
    # Ensure isnew is set to True
    for p in novedades:
        p['isnew'] = True

    print(f"=======================================================")
    print(f"🔍 全量商品: {len(catalog)} 款 | 识别出新品: {len(novedades)} 款")
    print(f"=======================================================")

    # Sort alphanumerically by SKU
    novedades.sort(key=lambda x: x.get('usercode') or x.get('code') or '')

    # 1. Output JSON to project data directories
    target_dirs = [
        os.path.join(REPO_ROOT, 'public/data'),
        os.path.join(REPO_ROOT, 'src/data'),
        os.path.join(REPO_ROOT, 'shop/data'),
        DOWNLOADS_DIR
    ]

    for d in target_dirs:
        os.makedirs(d, exist_ok=True)
        json_path = os.path.join(d, 'novedades_catalog.json')
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(novedades, f, ensure_ascii=False, indent=2)

        csv_no_price = os.path.join(d, 'novedades_catalog_no_price.csv')
        with open(csv_no_price, 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['条码 (EAN)', '型号/货号 (Ref)', '西语品名', '中文品名', '分类', '小包装数量', '整箱装箱量', '高清实拍图'])
            for p in novedades:
                writer.writerow([
                    p.get('code', ''),
                    p.get('usercode', ''),
                    p.get('namees', ''),
                    p.get('namecn', ''),
                    p.get('category', ''),
                    p.get('packet', 1),
                    p.get('box', 1),
                    p.get('imageUrl', '')
                ])

    # 2. Generate Professional Formatted Excel files
    wb_with = openpyxl.Workbook()
    ws_with = wb_with.active
    ws_with.title = "2026新品进货底表"

    header_font = Font(name='Arial', size=11, bold=True, color='FFFFFF')
    header_fill = PatternFill(start_color='1E3A8A', end_color='1E3A8A', fill_type='solid')
    border = Border(left=Side(style='thin', color='DDDDDD'), right=Side(style='thin', color='DDDDDD'),
                    top=Side(style='thin', color='DDDDDD'), bottom=Side(style='thin', color='DDDDDD'))

    headers_with = [
        '序号', '货号/型号 (Ref)', '条码 (EAN)', '西语品名', '中文品名',
        '一级品类', '进货单价 (€)', '建议零售价 (€)', '小包装数', '整包金额 (€)', '装箱量', '整箱金额 (€)', '实拍图片'
    ]
    ws_with.append(headers_with)
    for col_idx in range(1, len(headers_with) + 1):
        cell = ws_with.cell(row=1, column=col_idx)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal='center', vertical='center')

    for idx, p in enumerate(novedades, start=1):
        cost = p.get('price', 0)
        pvp = round(cost * 2.8, 2)
        packet = p.get('packet', 1)
        box = p.get('box', 1)
        row = [
            idx,
            p.get('usercode', ''),
            p.get('code', ''),
            p.get('namees', ''),
            p.get('namecn', ''),
            p.get('deptZh', p.get('deptEs', '')),
            cost,
            pvp,
            packet,
            round(cost * packet, 3),
            box,
            round(cost * box, 3),
            p.get('imageUrl', '')
        ]
        ws_with.append(row)

    excel_with_path = os.path.join(DOWNLOADS_DIR, 'novedades_2026_with_price.xlsx')
    wb_with.save(excel_with_path)

    # No Price version for clients & schools
    wb_no = openpyxl.Workbook()
    ws_no = wb_no.active
    ws_no.title = "2026新品选品展厅目录"

    header_fill_no = PatternFill(start_color='B45309', end_color='B45309', fill_type='solid')
    headers_no = ['序号', '货号/型号 (Ref)', '条码 (EAN)', '西语品名', '中文品名', '一级品类', '小包装数', '装箱量', '实拍图链接']
    ws_no.append(headers_no)
    for col_idx in range(1, len(headers_no) + 1):
        cell = ws_no.cell(row=1, column=col_idx)
        cell.font = header_font
        cell.fill = header_fill_no
        cell.alignment = Alignment(horizontal='center', vertical='center')

    for idx, p in enumerate(novedades, start=1):
        row = [
            idx,
            p.get('usercode', ''),
            p.get('code', ''),
            p.get('namees', ''),
            p.get('namecn', ''),
            p.get('deptZh', p.get('deptEs', '')),
            p.get('packet', 1),
            p.get('box', 1),
            p.get('imageUrl', '')
        ]
        ws_no.append(row)

    excel_no_path = os.path.join(DOWNLOADS_DIR, 'novedades_2026_no_price.xlsx')
    wb_no.save(excel_no_path)

    print(f"\n🎉 独立新品 Catalog 导出完毕！共 {len(novedades)} 款最新到店新品：")
    print(f"  📊 内部进货底表 (含价格): {excel_with_path}")
    print(f"  🏛️ 客户对外展厅 (无价格): {excel_no_path}")
    print(f"  🌐 独立新品 JSON 目录: {os.path.join(REPO_ROOT, 'public/data/novedades_catalog.json')}")

if __name__ == '__main__':
    main()
