#!/usr/bin/env python3
"""
Normalize and standardize Main Paper Catalog data:
1. Map all 6,109 products into 11 Official Catalog Departments and clean Subcategories,
   strictly aligned with:
   - CAT_AGENDAS-Y-CALENDARIOS_2027_web.pdf (Dedicated 2027 Agendas & Calendars Catalog)
   - CATALOGO-GENERAL-2026_ESP_web-MP--273d4734.pdf (Official 2026 General Catalog)
2. Isolate Greeting Cards (TEM1, EX025) away from Agendas into 'Licencias, Sanrio y Regalo'.
3. Naturally sort all products alphanumerically by SKU / usercode (e.g. AG27-01..12, CE27-01..09, PA137..).
4. Fix Spanish character corruptions (ESPA?OL -> Español, CUMPLEA?OS -> Cumpleaños, etc.).
5. Split bilingual categories into clean Spanish and clean Chinese fields.
6. Regenerate all 4 manifest files across all project and user directories.
"""

import os
import json
import csv
import re

# Master Department definitions
MASTER_DEPT_INFO = {
    '01': ('01', '📅 Agendas y Calendarios 2027', '📅 年历与日历 (2027专刊)'),
    '02': ('02', '✏️ Escritura y Corrección', '✏️ 书写与修正用品'),
    '03': ('03', '📎 Sobremesa y Oficina', '📎 桌面与办公用品'),
    '04': ('04', '📁 Archivo y Clasificación', '📁 文件归档与分类'),
    '05': ('05', '📓 Cuadernos y Manipulado', '📓 本册与纸品 (Manipulado)'),
    '06': ('06', '🎒 Mochilas y Escolar', '🎒 箱包与学生用品'),
    '07': ('07', '✂️ Manualidades y Adhesivos', '✂️ 手工与胶粘用品'),
    '08': ('08', '🎨 Bellas Artes (Artix)', '🎨 美术画材 (Artix)'),
    '09': ('09', '🏷️ Primeras Marcas', '🏷️ 国际合作名牌'),
    '10': ('10', '🎀 Licencias, Sanrio y Regalo', '🎀 三丽鸥、IP与贺卡'),
    '11': ('11', '📦 Expositores y PLV', '📦 展架与陈列物料'),
}

# Fine-grained subcategory mappings for standard topid:subid
SUBCAT_MAP = {
    # 02. Escritura y Corrección (topid 016, 022, 025)
    '016:': ('Bolígrafos y Escritura General', '书写工具综合'),
    '016:0BA': ('Bolígrafos Gel y Aceite', '中性笔与中油笔'),
    '016:109': ('Bolígrafos Suaves y Mini', '超顺滑中性笔与便携笔'),
    '016:14E': ('Bolígrafos Borrables', '可擦中性笔'),
    '016:18C': ('Lápices de Grafito y Sets', '木质铅笔与书写套装'),
    '016:1C1': ('Portaminas y Minas', '自动铅笔与铅芯'),
    '016:1F4': ('Estuches de Minas', '自动铅笔芯'),
    '016:221': ('Marcadores Fluorescentes', '荧光划线笔'),
    '016:24B': ('Marcadores para Pizarra', '白板记号笔'),
    '016:272': ('Marcadores Permanentes y CD', '油性记号笔与光盘笔'),
    '016:293': ('Marcadores de Pintura', '高光油漆笔'),
    '016:2B3': ('Plumas y Tinta Líquida', '钢笔与水性笔'),
    '016:2D0': ('Detectores de Billetes y Especiales', '验钞笔与特种笔'),
    '016:2E8': ('Bolígrafos Fantasía y Giroscopio', '创意解压造型笔'),
    '016:300': ('Sets de Escritura Creativos', '创意文具套装'),
    '022:': ('Correctores y Cintas', '修正用品综合'),
    '022:0C8': ('Cintas y Líquidos Correctores', '修正液与修正带'),
    '025:': ('Gomas de Borrar', '橡皮擦'),
    '025:0C9': ('Sacapuntas con y sin Depósito', '削笔器与卷笔刀'),

    # 03. Sobremesa y Oficina (topid 031, 034, 037)
    '031:': ('Corte y Medición General', '刀剪与测量工具'),
    '031:0CA': ('Tijeras y Cúteres', '美工刀与办公剪刀'),
    '031:116': ('Lupas y Medición', '放大镜与量具'),
    '031:15A': ('Calculadoras de Sobremesa', '电子计算器'),
    '034:': ('Encuadernación y Organización', '装订与收纳配件'),
    '034:0CB': ('Perforadoras y Quitagrapas', '打孔机与起钉器'),
    '034:117': ('Clips y Sujetapapeles', '长尾夹与回形针'),
    '034:15B': ('Chinchetas y Accesorios de Mesa', '工字钉与桌面小配件'),
    '034:197': ('Organizador de Escritorio', '笔筒与桌面收纳'),
    '034:1CB': ('Almohadillas de Sello y Tinta', '印台与印油'),
    '034:1FD': ('Alfombrillas de Escritorio', '桌面写字垫'),
    '037:': ('Artículos de Oficina General', '办公耗材综合'),
    '037:0BD': ('Papelería de Oficina y Tiques', '收银纸与办公单据'),
    '037:10C': ('Fundas para Tarjetas y Acreditación', '证件卡套与挂绳'),
    '037:151': ('Pizarras y Accesorios', '白板与磁性配件'),
    '037:18F': ('Máquinas y Material de Oficina', '办公设备与塑封膜'),
    '037:24D': ('Bolsas de Compra y Embalaje', '购物袋与包装袋'),

    # 04. Archivo y Clasificación (topid 051)
    '051:': ('Carpetas y Archivo General', '文件管理综合'),
    '051:0C2': ('Carpetas con Fundas', '透明插页资料册'),
    '051:111': ('Carpetas con Separadores', '分类索引文件夹'),
    '051:156': ('Carpetas Fuelle', '风琴包收纳夹'),
    '051:194': ('Fundas Multitaladro', '11孔内页资料袋'),
    '051:1C8': ('Carpetas con Cremallera', '网格拉链袋'),
    '051:1FA': ('Carpetas con Botón', '按扣文件袋'),
    '051:227': ('Carpetas Velcro y Cuerda', '魔术扣与绳扣袋'),
    '051:251': ('Carpetas de Gomas', '绑带文件套'),
    '051:277': ('Cajas de Archivo Definitivo', '档案文件盒'),
    '051:297': ('Carpetas con Pinza (Clipboard)', '写字板夹'),
    '051:2B7': ('Carpetas Simples y Dossiers', '简易报告夹'),

    # 05. Cuadernos y Manipulado (topid 046, 049)
    '046:': ('Cuadernos Escolares General', '学生本册综合'),
    '046:0CD': ('Cuadernos de Tapa Blanda', '软皮练习本'),
    '046:119': ('Cuadernos Tapa Dura y Espiral', '硬皮与线圈笔记本'),
    '046:15C': ('Cuadernos Portugueses', '葡萄牙语格式练习本'),
    '046:198': ('Forros de Libros', '自粘包书皮'),
    '046:1CC': ('Separadores de Cuaderno', '笔记本隔板'),
    '049:': ('Papel y Blocks General', '纸品与本册综合'),
    '049:0CE': ('Libretas de Bolsillo', '随身便携笔记本'),
    '049:11A': ('Diarios y Agendas Personales', '密码日记本'),
    '049:15D': ('Cuadernos Creativos y Bocetos', '素描与速写本'),
    '049:199': ('Papel Especial y Dibujo', '特种绘图纸'),
    '049:1CD': ('Recambios y Blocks de Carta', '活页替芯与信纸本'),
    '049:1FE': ('Papel de Copia A4 NotePlus', 'A4复印纸与纸张'),

    # 06. Mochilas y Escolar (topid 042, 040)
    '042:': ('Mochilas y Bolsas General', '箱包综合'),
    '042:0BC': ('Portameriendas Térmicos', '保温餐包与便当包'),
    '042:10B': ('Estuches Escolares', '学生笔袋与文具盒'),
    '042:150': ('Mochilas de Cordones', '束口抽绳背包'),
    '042:18E': ('Identificadores de Maletas', '行李牌与旅行挂件'),
    '040:': ('Artículos Escolares Generales', '学生校园生活用品'),

    # 07. Manualidades y Adhesivos (topid 055, 028)
    '055:': ('Manualidades General', '手工材料综合'),
    '055:0BE': ('Goma EVA', 'EVA 手工泡棉板'),
    '055:10D': ('Fieltro para Manualidades', '彩色手工毛毡布'),
    '055:152': ('Papeles Artesanales Especiales', '折纸、皱纹纸与卡纸'),
    '055:190': ('Tableros de Madera y Foam', '木质画板与泡沫板'),
    '055:1C4': ('Accesorios para Manualidades', '毛条、活动眼睛与彩珠'),
    '055:1F7': ('Herramientas de Manualidades', '手工剪裁与热熔胶枪'),
    '055:224': ('Papeles Artesanales en Bolsas', '袋装手工卡纸'),
    '028:': ('Adhesivos y Cintas General', '胶粘用品综合'),
    '028:0C0': ('Pegamento Líquido y Barra', '液体胶水与固体胶棒'),
    '028:10F': ('Cinta Adhesiva y Embalaje', '文具胶带与封箱胶带'),
    '028:154': ('Pegamento Instantáneo 502', '502强力速干胶'),
    '028:192': ('Pegatinas Decorativas', '手账贴纸与装饰贴'),
    '028:1C6': ('Pegatinas Autoadhesivas y Gomets', '彩色标签贴与圆点贴'),

    # 08. Bellas Artes (Artix) (topid 053, 013)
    '053:': ('Bellas Artes General', '美术画材综合'),
    '053:0BB': ('Rotuladores Escolares', '儿童彩色水彩笔'),
    '053:10A': ('Lápices de Dibujo y Carboncillo', '素描铅笔与炭精条'),
    '053:14F': ('Lápices de Colores', '彩色铅笔'),
    '053:18D': ('Ceras, Pasteles y Témperas', '油画棒与色粉笔'),
    '053:1C2': ('Rotuladores Artísticos y Calibrados', '针管笔与马克笔'),
    '053:1F5': ('Pintura Acuarela', '水彩颜料'),
    '053:222': ('Pintura Témpera', '水粉颜料'),
    '053:24C': ('Pintura Acrílica (Artix)', 'Artix 专业丙烯颜料'),
    '053:273': ('Pintura al Óleo', '专业油画颜料'),
    '053:2B4': ('Accesorios para Pintura', '调色盘与画油辅材'),
    '053:2D1': ('Sellos Infantiles', '儿童趣味印章'),
    '053:2E9': ('Arcilla y Plastilina', '橡皮泥、陶泥与轻粘土'),
    '053:301': ('Sets de Pintura Artix', '美术颜料礼盒套装'),
    '053:313': ('Papel Bellas Artes y Acuarela', '专业水彩本与素描纸'),
    '053:324': ('Caballetes y Lienzos', '纯棉画框与画架'),
    '053:334': ('Pinceles y Paletinas', '美术画笔与板刷'),
    '053:344': ('Herramientas de Bellas Artes', '油画刮刀与雕塑工具'),
    '053:355': ('Accesorios de Dibujo', '擦笔与绘画辅助工具'),
    '053:375': ('Otras Pinturas Especiales', '纺织与特效颜料'),
    '013:': ('Colección BeBasic', 'BeBasic 高性价比画材'),
    '013:0C6': ('BeBasic Papelería', 'BeBasic 基础文具'),
    '013:115': ('BeBasic Bellas Artes', 'BeBasic 基础画材'),

    # 09. Primeras Marcas (topid 057)
    '057:': ('Primeras Marcas General', '国际合作名牌综合'),
    '057:0C4': ('Talens', '荷兰泰伦斯专业画材'),
    '057:113': ('Edding', '德国艾丁记号笔'),
    '057:158': ('Stabilo', '德国思笔乐荧光笔'),
    '057:196': ('Pilot', '日本百乐中性笔与可擦笔'),
    '057:1CA': ('Alpino', '西班牙阿尔皮诺儿童画材'),
    '057:1FC': ('Staedtler', '德国施德楼经典绘图文具'),
    '057:253': ('Milan', '西班牙米兰精品橡皮与笔'),
    '057:279': ('Oxford', '法国牛津高品质活页本'),
    '057:299': ('Bic', '法国比克经典圆珠笔'),
    '057:2B9': ('Faber-Castell', '德国辉柏嘉彩铅与铅笔'),
    '057:2D5': ('Sadipal', 'Sadipal 创意包装纸品'),
    '057:2ED': ('Rubio', '西班牙鲁比奥字帖与练习册'),
    '057:315': ('Pritt', '德国百特安全固体胶'),
    '057:346': ('Uni-Ball', '日本三菱书写笔与Posca'),
    '057:3A7': ('Otras Marcas', '其它国际品牌'),

    # 10. Sanrio, Licencias y Regalo (topid 059, 007, 004)
    '059:': ('Licencias y Colecciones', 'IP主题授权系列综合'),
    '059:195': ('Sanrio (Hello Kitty / Kuromi)', '三丽鸥官方授权系列'),
    '059:228': ('Serie Big Dream Girls', '追梦女孩系列'),
    '007:': ('Tarjetas de Felicitación', '节庆与祝福贺卡'),
    '007:0D0': ('Tarjetas de Ocasión y Cumpleaños', '生日与节日贺卡'),
    '004:': ('Campaña Navidad y Fiestas', '圣诞与节庆专场'),

    # 11. Expositores y PLV (topid 061, 063)
    '061:': ('Expositores Comerciales', '商业陈列展架'),
    '061:0C7': ('Expositor Vacío de Suelo', '落地空展架'),
    '063:': ('Exhibición de Imagen y PLV', '品牌形象与展示物料'),
    '063:0C5': ('Material Publicitario y POP', '宣传POP与亚克力配件'),
    '063:114': ('Cartelería y Soportes', '海报、画报与展示物料'),
}

def clean_text(text):
    if not text:
        return ''
    t = str(text)
    # Fix broken encodings
    t = t.replace('CUMPLEA?OS', 'CUMPLEAÑOS')
    t = t.replace('Cumplea?os', 'Cumpleaños')
    t = t.replace('cumplea?os', 'cumpleaños')
    t = t.replace('ESPA?OL', 'ESPAÑOL')
    t = t.replace('Espa?ol', 'Español')
    t = t.replace('espa?ol', 'español')
    t = t.replace('PEQUE?O', 'PEQUEÑO')
    t = t.replace('Peque?o', 'Pequeño')
    t = t.replace('peque?o', 'pequeño')
    t = t.replace('DISE?O', 'DISEÑO')
    t = t.replace('Dise?o', 'Diseño')
    t = t.replace('dise?o', 'diseño')
    t = t.replace('BA?O', 'BAÑO')
    t = t.replace('Ba?o', 'Baño')
    t = t.replace('ba?o', 'baño')
    t = t.replace('NI?O', 'NIÑO')
    t = t.replace('Ni?o', 'Niño')
    t = t.replace('ni?o', 'niño')
    t = t.replace('A?O', 'AÑO')
    t = t.replace('A?o', 'Año')
    t = t.replace('a?o', 'año')
    t = t.replace('óN', 'ÓN')
    t = t.replace('íA', 'ÍA')
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def natural_sort_key(s):
    """Natural alphanumeric sort key, so 'AG27-2' comes before 'AG27-10'."""
    return [int(text) if text.isdigit() else text.lower() for text in re.split(r'(\d+)', s or '')]

def classify_product(p):
    tid = str(p.get('topid', ''))
    sid = str(p.get('subid', ''))
    uc = clean_text(p.get('usercode', '')).upper()
    ne = clean_text(p.get('namees', '')).upper()

    # Rule 1: Greeting Cards (Tarjetas de Felicitación / Celebración)
    # The legacy database put TEM1 cards into topid 010 and 007. They belong in 'Licencias y Regalo'!
    is_card = 'TARJETA' in ne or uc.startswith('TEM1') or (
        tid in ['007', '010'] and (uc.startswith('EX025') or sid == '' or sid == '0D0') and not uc.startswith('AG') and not uc.startswith('CE') and not uc.startswith('CL')
    )
    if is_card:
        m_id, d_es, d_zh = MASTER_DEPT_INFO['10']
        return m_id, d_es, d_zh, 'Tarjetas de Felicitación y Eventos', '节庆与祝福贺卡'

    # Rule 2: Dedicated Agendas & Calendarios 2027
    # Exactly matching CAT_AGENDAS-Y-CALENDARIOS_2027_web.pdf
    is_agenda = (
        tid == '010' and sid in ['110', '155', '193', '1C7', '1F9', '226']
    ) or uc.startswith('AG2') or uc.startswith('CE27') or uc.startswith('CE267') or uc.startswith('CL27') or 'AGENDA' in ne or 'CALENDARIO' in ne or uc in ['EX161-500', 'MP000-197', 'PN000-52']
    
    # Exclude items that are clearly art deco or display furniture from agendas unless they are agenda expositors
    if is_agenda:
        m_id, d_es, d_zh = MASTER_DEPT_INFO['01']
        if uc.startswith('EX') or 'EXPOSITOR' in ne:
            return m_id, d_es, d_zh, 'Expositores de Agendas 2027', '年历展架'
        if uc.endswith('PT') or 'PORTUGU' in ne or (sid in ['110', '1C7', '226'] and 'PT' in uc):
            return m_id, d_es, d_zh, 'Coleção Portugal (PT)', '葡萄牙语年历日历'
        if uc.endswith('CT') or 'CATAL' in ne or sid == '193':
            return m_id, d_es, d_zh, 'Col·lecció Cataluña (CAT)', '加泰罗尼亚语年历'
        if 'AG26' in uc or 'CE267' in uc or 'ESCOLAR' in ne or sid == '226':
            return m_id, d_es, d_zh, 'Agendas Escolares 2026/2027', '2026/2027 学生日程本'
        if 'CALENDARIO' in ne or 'AG27C' in uc or 'CL27' in uc or 'CE27C' in uc or sid == '1C7':
            return m_id, d_es, d_zh, 'Calendarios 2027 (Pared y Mesa)', '2027 挂历与台历'
        if uc.startswith('CE27') or 'CERVANTES' in ne or 'PREMIUM' in ne:
            return m_id, d_es, d_zh, 'Agendas Anuales 2027 (Cervantes / Premium)', '2027 高档塞万提斯年历'
        return m_id, d_es, d_zh, 'Agendas Anuales 2027 (Style & Classic)', '2027 时尚经典年历'

    # Rule 3: Emoji series misclassified into Expositores (EM24xxx)
    if uc.startswith('EM24') or 'EMOJI' in ne:
        m_id, d_es, d_zh = MASTER_DEPT_INFO['10']
        return m_id, d_es, d_zh, 'Serie Emoji', 'Emoji 表情包系列'

    # Rule 4: Match standard mappings
    cat_key = f'{tid}:{sid}'
    top_key = f'{tid}:'
    sub_tuple = SUBCAT_MAP.get(cat_key) or SUBCAT_MAP.get(top_key)
    sub_es = sub_tuple[0] if sub_tuple else 'Varios'
    sub_zh = sub_tuple[1] if sub_tuple else '综合商品'

    # Master department assignment
    if tid in ['016', '022', '025']:
        m_id, d_es, d_zh = MASTER_DEPT_INFO['02']
    elif tid in ['031', '034', '037']:
        m_id, d_es, d_zh = MASTER_DEPT_INFO['03']
    elif tid in ['051']:
        m_id, d_es, d_zh = MASTER_DEPT_INFO['04']
    elif tid in ['046', '049']:
        m_id, d_es, d_zh = MASTER_DEPT_INFO['05']
    elif tid in ['042', '040']:
        m_id, d_es, d_zh = MASTER_DEPT_INFO['06']
    elif tid in ['055', '028']:
        m_id, d_es, d_zh = MASTER_DEPT_INFO['07']
    elif tid in ['053', '013']:
        m_id, d_es, d_zh = MASTER_DEPT_INFO['08']
    elif tid in ['057']:
        m_id, d_es, d_zh = MASTER_DEPT_INFO['09']
    elif tid in ['059', '007', '004']:
        m_id, d_es, d_zh = MASTER_DEPT_INFO['10']
    elif tid in ['061', '063']:
        m_id, d_es, d_zh = MASTER_DEPT_INFO['11']
    else:
        m_id, d_es, d_zh = MASTER_DEPT_INFO['02']

    return m_id, d_es, d_zh, sub_es, sub_zh

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    source_json = os.path.join(root_dir, 'public/data/catalog.json')

    with open(source_json, 'r', encoding='utf-8') as f:
        data = json.load(f)

    clean_with_price = []
    clean_no_price = []

    for p in data:
        master_id, dept_es, dept_zh, sub_es, sub_zh = classify_product(p)

        namees = clean_text(p.get('namees', ''))
        namecn = clean_text(p.get('namecn', ''))
        usercode = clean_text(p.get('usercode', ''))
        code = clean_text(p.get('code', ''))

        clean_item = {
            "id": str(p.get('id', '')),
            "code": code,
            "usercode": usercode,
            "namees": namees,
            "namecn": namecn,
            "masterId": master_id,
            "deptEs": dept_es,
            "deptZh": dept_zh,
            "subEs": sub_es,
            "subZh": sub_zh,
            "category": f"{sub_es} {sub_zh}",
            "topid": str(p.get('topid', '')),
            "subid": str(p.get('subid', '')),
            "packet": int(p.get('packet', 1)),
            "box": int(p.get('box', 1)),
            "stock": p.get('stock', 1),
            "isnew": bool(p.get('isnew', False)),
            "ishot": bool(p.get('ishot', False)),
            "ispromote": bool(p.get('ispromote', False)),
            "imageUrl": p.get('imageUrl', ''),
        }

        cost = float(p.get('price', 0))
        clean_with = {
            **clean_item,
            "price": cost,
            "packetPrice": round(cost * clean_item['packet'], 3),
            "boxPrice": round(cost * clean_item['box'], 3)
        }
        clean_with_price.append(clean_with)
        clean_no_price.append(clean_item)

    # CRUCIAL: Sort the entire catalog naturally by (masterId, usercode)
    # This guarantees that all exported JSON and CSV files are strictly ordered by official SKU!
    print("🔄 正在按官方目录结构与 SKU 货号自然排序...")
    clean_with_price.sort(key=lambda x: (x['masterId'], natural_sort_key(x['usercode'] or x['code'])))
    clean_no_price.sort(key=lambda x: (x['masterId'], natural_sort_key(x['usercode'] or x['code'])))

    print(f"✅ 处理完毕！共规范化并排序 {len(clean_with_price)} 款商品。")

    # Target directories
    dirs_to_update = [
        os.path.join(root_dir, 'public/data'),
        os.path.join(root_dir, 'data'),
        os.path.join(root_dir, 'src/data'),
        '/Users/dengyu/Downloads/MainPaper_2026_Catalog',
        '/Users/dengyu/CentrodeVender/MainPaper_Full_Images'
    ]

    for d in dirs_to_update:
        os.makedirs(d, exist_ok=True)
        # JSON output
        catalog_path = os.path.join(d, 'catalog.json')
        with_price_path = os.path.join(d, 'mainpaper_catalog_with_price.json')
        no_price_path = os.path.join(d, 'mainpaper_catalog_no_price.json')

        with open(with_price_path, 'w', encoding='utf-8') as f:
            json.dump(clean_with_price, f, ensure_ascii=False, indent=2)
        with open(no_price_path, 'w', encoding='utf-8') as f:
            json.dump(clean_no_price, f, ensure_ascii=False, indent=2)
        if os.path.exists(catalog_path) or 'data' in d:
            with open(catalog_path, 'w', encoding='utf-8') as f:
                json.dump(clean_with_price, f, ensure_ascii=False, indent=2)

        # CSV output
        with open(os.path.join(d, 'mainpaper_catalog_with_price.csv'), 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([
                '条码 (EAN)', '货号/型号 (Ref)', '西语品名', '中文品名', 
                '一级大类 (Departamento)', '二级细分 (Categoría)', 
                '进货单价 (€)', '建议零售价 PVP 2.8x (€)',
                '小包装数量 (Packet)', '小包整包金额 (€)', 
                '外箱装箱量 (Box)', '整箱总金额 (€)', 
                '新品 (New)', '热销爆款 (Hot)', '促销状态', '2K高清实拍图链接'
            ])
            for p in clean_with_price:
                pvp = round(p['price'] * 2.8, 2)
                writer.writerow([
                    p['code'], p['usercode'], p['namees'], p['namecn'],
                    f"{p['deptZh']} ({p['deptEs']})", f"{p['subZh']} ({p['subEs']})",
                    p['price'], pvp,
                    p['packet'], p['packetPrice'],
                    p['box'], p['boxPrice'],
                    '是' if p['isnew'] else '否', '是' if p['ishot'] else '否',
                    '促销' if p['ispromote'] else '正常',
                    p['imageUrl']
                ])

        with open(os.path.join(d, 'mainpaper_catalog_no_price.csv'), 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([
                '条码 (EAN)', '货号/型号 (Ref)', '西语品名', '中文品名', 
                '一级大类 (Departamento)', '二级细分 (Categoría)', 
                '小包装数量 (Packet)', '外箱装箱量 (Box)', 
                '新品 (New)', '热销爆款 (Hot)', '2K高清实拍图链接'
            ])
            for p in clean_no_price:
                writer.writerow([
                    p['code'], p['usercode'], p['namees'], p['namecn'],
                    f"{p['deptZh']} ({p['deptEs']})", f"{p['subZh']} ({p['subEs']})",
                    p['packet'], p['box'],
                    '是' if p['isnew'] else '否', '是' if p['ishot'] else '否',
                    p['imageUrl']
                ])

        print(f"  📁 已更新目录文件: {d}")

if __name__ == '__main__':
    main()
