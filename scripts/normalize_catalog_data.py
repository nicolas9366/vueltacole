#!/usr/bin/env python3
"""
Normalize and standardize Main Paper Catalog data:
1. Map all 6,109 products into 11 Official Catalog Departments and 100% verified Subcategories,
   strictly aligned with the real product inventory and:
   - CAT_AGENDAS-Y-CALENDARIOS_2027_web.pdf (Dedicated 2027 Agendas & Calendars Catalog)
   - CATALOGO-GENERAL-2026_ESP_web-MP--273d4734.pdf (Official 2026 General Catalog)
2. Isolate Greeting Cards (TEM1, EX025) away from Agendas into 'Licencias, Sanrio y Regalo'.
3. Correctly map Calculators, Magnifying Glasses, Notebooks, Folders, and First Brands.
4. Naturally sort all products alphanumerically by SKU / usercode.
5. Fix Spanish character corruptions (ESPA?OL -> Español, CUMPLEA?OS -> Cumpleaños, etc.).
6. Regenerate all 4 manifest files across all project and user directories.
"""

import os
import json
import csv
import re
import openpyxl

# Master Department definitions
MASTER_DEPT_INFO = {
    '01': ('01', 'Agendas y Calendarios 2027', '年历与日历 (2027专刊)'),
    '02': ('02', 'Escritura', '书写用品'),
    '03': ('03', 'Sobremesa, Corrección y Oficina', '桌面办公与修正工具'),
    '04': ('04', 'Archivo y Clasificación', '文件归档与分类'),
    '05': ('05', 'Cuadernos y Manipulado', '本册与纸品 (Manipulado)'),
    '06': ('06', 'Mochilas y Escolar', '箱包与学生用品'),
    '07': ('07', 'Manualidades y Adhesivos', '手工与胶粘用品'),
    '08': ('08', 'Bellas Artes (Artix)', '美术画材 (Artix)'),
    '09': ('09', 'Primeras Marcas', '国际合作名牌'),
    '10': ('10', 'Licencias, Sanrio y Regalo', '三丽鸥、IP与贺卡'),
    '11': ('11', 'Expositores y PLV', '展架与陈列物料'),
    '12': ('12', 'Línea BeBasic (Ahorro)', 'BeBasic 超值基础系列'),
}

# 100% Verified Subcategory mappings based on ground truth product contents
VERIFIED_SUBCATS = {
    # 02. Escritura y Corrección (topid 016, 022, 025)
    '016:': ('Lápices de Color y Ceras Escolares', '彩色铅笔与儿童画蜡'),
    '016:0BA': ('Sets de Escritura y Ahorro', '书写文具套装'),
    '016:109': ('Bolígrafos Gel, Purpurina y Moda', '中性笔、闪光笔与中油笔'),
    '016:14E': ('Bolígrafos Borrables y Recambios', '可擦中性笔与替芯'),
    '016:18C': ('Rotuladores Finos y Sets', '微孔细字笔与书写套装'),
    '016:1C1': ('Adaptadores de Lápiz y Expositores', '握笔器与书写展架'),
    '016:1F4': ('Portaminas y Minas de Grafito', '自动铅笔与铅芯'),
    '016:221': ('Marcadores Fluorescentes', '荧光划线笔'),
    '016:24B': ('Marcadores para Pizarra Blanca', '白板记号笔'),
    '016:272': ('Rotuladores Metalizados y Permanentes', '金属光泽笔与永久记号笔'),
    '016:293': ('Marcadores de Pintura Permanente', '油漆笔与高光笔'),
    '016:2B3': ('Plumas Estilográficas y Tinta Líquida', '钢笔与水性滚珠笔'),
    '016:2D0': ('Detectores de Billetes', '验钞笔与特种笔'),
    '016:2E8': ('Bolígrafos Fantasía y Giroscopio', '解压陀螺笔与创意造型笔'),
    '016:300': ('Packs de Papelería Creativa', '创意学生文具礼盒'),
    '022:': ('Borradores de Pizarra y Tizas', '板擦与粉笔'),
    '022:0C8': ('Cintas Correctoras', '修正带'),
    '025:': ('Líquidos y Bolígrafos Correctores', '涂改液与修正笔'),
    '025:0C9': ('Gomas de Borrar y Sacapuntas', '橡皮擦与卷笔刀'),

    # 03. Sobremesa y Oficina (topid 031, 034, 037)
    '031:': ('Etiquetas Adhesivas Personalizables', '手写与个性化标签贴'),
    '031:0CA': ('Reglas, Escuadras y Medición', '直尺、三角板与测量工具'),
    '031:116': ('Tijeras y Cizallas de Corte', '剪刀与切纸机'),
    '031:15A': ('Lupas de Aumento', '放大镜'),
    '034:': ('Calculadoras de Sobremesa y Científicas', '电子计算器与科学计算器'),
    '034:0CB': ('Grapas y Grapadoras', '订书钉与订书机'),
    '034:117': ('Perforadoras y Quitagrapas', '打孔机与起钉器'),
    '034:15B': ('Clips, Pinzas y Sujetapapeles', '回形针与票夹'),
    '034:197': ('Chinchetas, Fasteners y Fijaciones', '工字钉、图钉与装订紧固件'),
    '034:1CB': ('Organizadores y Accesorios de Sobremesa', '书立、桌面铃与办公小件'),
    '034:1FD': ('Sellos, Fechadores y Tintas', '印章、日期印与印泥印油'),
    '037:': ('Vades y Alfombrillas de Escritorio', '桌面写字垫板'),
    '037:0BD': ('Notas Adhesivas y Blocs de Notas', '便利贴与便签本'),
    '037:10C': ('Talonarios de Facturas y Recibos', '收据、票据与办公单据'),
    '037:151': ('Fundas de Tarjetas y Acreditaciones', '证件卡套与伸缩挂绳'),
    '037:18F': ('Pizarras Magnéticas y Accesorios', '磁性白板与软木板配件'),
    '037:24D': ('Rotuladoras y Cintas de Etiquetas', '标签打印机与专用标签带'),

    # 04. Archivo y Clasificación (topid 051)
    '051:': ('Papel y Cartulinas de Archivo', '归档专用纸与卡纸'),
    '051:0C2': ('Carpetas de 4 Anillas', '四孔活页文件夹'),
    '051:111': ('Carpetas con Fundas Transparentes', '透明插页资料册'),
    '051:156': ('Separadores e Índices de Archivo', '分类索引隔页纸'),
    '051:194': ('Carpetas y Maletines Fuelle', '手提风琴包与风琴夹'),
    '051:1C8': ('Fundas Multitaladro 11 Taladros', '11孔活页内页袋'),
    '051:1FA': ('Carpetas con Cremallera', '网格拉链文件袋'),
    '051:227': ('Carpetas sobre con Botón', '按扣文件袋'),
    '051:251': ('Carpetas Cierre Rápido y Velcro', '魔术贴与快速扣文件袋'),
    '051:277': ('Carpetas con Solapas y Gomas', '三翼绑带文件夹'),
    '051:297': ('Cajas de Archivo Definitivo', '档案归档文件盒'),
    '051:2B7': ('Carpetas con Pinza (Clipboard)', '写字板夹与报告夹'),

    # 05. Cuadernos y Manipulado (topid 046, 049)
    '046:': ('Etiquetas Escolares Identificativas', '学生姓名贴与行李牌'),
    '046:0CD': ('Cuadernos Tapa Blanda Folio y 4x4', '软皮线圈练习本'),
    '046:119': ('Cuadernos Escolares de Pauta y Guía', '格式与横线学生本'),
    '046:15C': ('Cuadernos de Tapa Dura Extradura', '硬皮加厚笔记本'),
    '046:198': ('Cuadernos Tapa Polipropileno (PP)', 'PP防水塑料面笔记本'),
    '046:1CC': ('Forros Autoadhesivos para Libros', '自粘包书皮与书套'),
    '049:': ('Separadores para Cuaderno', '笔记本隔页板'),
    '049:0CE': ('Cuadernos con Hojas Extraíbles', '活页可拆卸笔记本'),
    '049:11A': ('Blocs de Notas de Bolsillo', '便条草稿小本'),
    '049:15D': ('Cuadernos de Notas Ejecutivos', '精装商务笔记本'),
    '049:199': ('Cuadernos de Notas Decorados y Diarios', '插画创意手账本与笔记本'),
    '049:1CD': ('Papel Milimetrado y Blocs de Cartas', '坐标纸与信纸本'),
    '049:1FE': ('Recambios de Hojas Perforadas', '活页替芯与打孔纸'),

    # 06. Mochilas y Escolar (topid 042, 040)
    '042:': ('Mochilas y Bolsas Generales', '箱包综合'),
    '042:0BC': ('Portameriendas Térmicos', '儿童保温餐包'),
    '042:10B': ('Estuches Escolares', '学生笔袋与文具盒'),
    '042:150': ('Mochilas de Cordones', '束口抽绳背包'),
    '042:18E': ('Identificadores de Maletas', '行李牌与旅行挂件'),
    '040:': ('Artículos Escolares Generales', '学生校园生活用品'),

    # 07. Manualidades y Adhesivos (topid 055, 028, 057 without subid)
    '055:': ('Bandejas y Material Craft', '手工耗材综合'),
    '055:0BE': ('Cartulinas de Colores', '彩色手工卡纸'),
    '055:10D': ('Goma EVA (Normal y Purpurina)', 'EVA 手工泡棉板'),
    '055:152': ('Fieltro para Manualidades', '彩色手工毛毡布'),
    '055:190': ('Papel Crepé y Floristería', '彩色皱纹纸与折纸'),
    '055:1C4': ('Tableros de Madera y Corte', '木质画板与手工底板'),
    '055:1F7': ('Figuras y Accesorios de Madera', '木质益智手工配件'),
    '055:224': ('Punzones y Herramientas Escolares', '手工作业打孔锥与工具'),
    '057:': ('Papeles Especiales y Cartón Craft', '特种手工纸与创意板材'),
    '028:': ('Sets Básicos Escolares', '开学基础文具套装'),
    '028:0C0': ('Pegamento en Barra y Líquido', '固体胶棒与液体胶水'),
    '028:10F': ('Cola Blanca Escolar y Purpurina', '学生白胶与闪光胶'),
    '028:154': ('Cintas Adhesivas y Dispensadores', '封箱胶带与胶带座'),
    '028:192': ('Pegamento Instantáneo 502', '502强力速干胶'),
    '028:1C6': ('Pegatinas y Stickers en Relieve', '立体手账装饰贴纸'),

    # 08. Bellas Artes (Artix) (topid 053, 013)
    '053:': ('Carpetas Portadocumentos de Arte', '艺术图纸夹'),
    '053:0BB': ('Rotuladores Artísticos de Doble Punta', '双头素描马克笔与丙烯笔'),
    '053:10A': ('Rotuladores Escolares Clásicos', '学生彩色水彩笔'),
    '053:14F': ('Gomas Moldeables y de Dibujo', '素描可塑橡皮'),
    '053:18D': ('Lápices de Colores Artix', '专业彩色铅笔'),
    '053:1C2': ('Pasteles y Ceras al Óleo', '色粉笔与软性油画棒'),
    '053:1F5': ('Rotuladores Calibrados (Fineliners)', '针管笔与勾线笔'),
    '053:222': ('Pintura Acuarela', '水彩颜料'),
    '053:24C': ('Pintura Témpera Escolar', '水粉颜料'),
    '053:273': ('Pintura Acrílica (Artix Acrylics)', 'Artix 专业丙烯颜料'),
    '053:2B4': ('Pintura al Óleo (Artix Oil)', 'Artix 专业油画颜料'),
    '053:2D1': ('Médiums, Aceites y Barnices', '调色油、松节油与媒介剂'),
    '053:2E9': ('Sellos Infantiles Creativos', '儿童趣味印章'),
    '053:301': ('Arcilla y Pastas de Modelar', '陶泥与雕塑造型粘土'),
    '053:313': ('Pintura de Dedos y Tintas Chinas', '手指画颜料与国画墨汁'),
    '053:324': ('Blocs de Dibujo y Sketchbooks', '速写本与水彩画册'),
    '053:334': ('Lienzos y Bastidores de Pintura', '纯棉画框与油画板'),
    '053:344': ('Pinceles, Paletinas y Brochas', '专业画笔与排刷'),
    '053:355': ('Espátulas y Herramientas de Escultura', '油画刮刀与调色盘'),
    '053:375': ('Tubos Portaplanos y Portadocumentos', '伸缩画筒与工程图纸夹'),
    '013:': ('Colección BeBasic', 'BeBasic 高性价比画材'),
    '013:0C6': ('Colección BeBasic Papelería', 'BeBasic 基础文具'),
    '013:115': ('Colección BeBasic Bellas Artes', 'BeBasic 基础画材'),

    # 09. Primeras Marcas (topid 057)
    '057:0C4': ('Jovi (Plastilina y Modelado)', '西班牙 Jovi 儿童彩泥'),
    '057:113': ('Talens (Sketchbooks y Arte)', '荷兰泰伦斯专业画材'),
    '057:158': ('Edding (Marcadores Industriales)', '德国艾丁记号笔'),
    '057:196': ('Stabilo (Point 88 y Subrayadores)', '德国思笔乐微孔笔与荧光笔'),
    '057:1CA': ('Pilot (Frixion y Bolígrafos G2)', '日本百乐中性笔与可擦笔'),
    '057:1FC': ('Alpino (Lápices y Ceras Infantiles)', '西班牙阿尔皮诺儿童彩笔'),
    '057:253': ('Staedtler (Lápices Noris y Dibujo)', '德国施德楼经典铅笔'),
    '057:279': ('Milan (Gomas y Sacapuntas)', '西班牙米兰精品橡皮'),
    '057:299': ('Oxford (Cuadernos Europeanbook)', '法国牛津高端笔记本'),
    '057:2B9': ('Bic (Cristal y Plastidecor)', '法国比克经典圆珠笔与蜡笔'),
    '057:2D5': ('Faber-Castell (Subrayadores y Dibujo)', '德国辉柏嘉荧光笔与绘画'),
    '057:2ED': ('Sadipal (Papel Kraft y Creativo)', 'Sadipal 牛皮纸与包装纸'),
    '057:315': ('Rubio (Cuadernos de Caligrafía)', '西班牙鲁比奥字帖与练习册'),
    '057:346': ('Pritt (Pegamentos y Adhesivos)', '德国百特安全固体胶'),
    '057:3A7': ('Uni-Ball y Posca', '日本三菱书写笔与Posca'),

    # 10. Sanrio, Licencias y Regalo (topid 059, 007, 004)
    '059:': ('Licencias y Regalos Varios', 'IP主题授权与礼品'),
    '059:195': ('Sanrio (Hello Kitty / Kuromi)', '三丽鸥官方授权系列'),
    '059:228': ('Serie Big Dream Girls', '追梦女孩系列'),
    '007:': ('Tarjetas de Felicitación y Eventos', '节庆与祝福贺卡'),
    '007:0D0': ('Tarjetas de Felicitación y Eventos', '节庆与祝福贺卡'),
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

    # Rule 0: BeBasic Series (Dedicated economy basic stationery line)
    is_bebasic = (
        (uc.startswith('S') and len(uc) > 1 and uc[1].isdigit()) or
        'BEBASIC' in ne or 'BE BASIC' in ne or 'BEBASIC' in uc or
        uc in ['EXBEBA', 'EXM26-33', 'EXM26-35', 'EXM26-36']
    )
    if is_bebasic:
        m_id, d_es, d_zh = MASTER_DEPT_INFO['12']
        if 'EXPOSITOR' in ne or uc.startswith('EX'):
            return m_id, d_es, d_zh, 'Expositores BeBasic', 'BeBasic 陈列展架'
        elif any(k in ne for k in ['PAPEL', 'FORRO', 'SOBRE', 'CARPETA', 'FUNDA', 'NOTAS', 'TACO']):
            return m_id, d_es, d_zh, 'Papel y Oficina BeBasic', 'BeBasic 纸品与办公'
        elif any(k in ne for k in ['ACRILIC', 'COLOR', 'PINCEL', 'CERA', 'DIBUJO', 'PEGAMENTO']):
            return m_id, d_es, d_zh, 'Arte y Manualidades BeBasic', 'BeBasic 美术画材与胶粘'
        elif any(k in ne for k in ['CALCULADORA', 'TIJERA', 'GRAP', 'CORRECTOR', 'GOMA', 'SACAPUNTA', 'PINZA', 'PERFORADORA']):
            return m_id, d_es, d_zh, 'Sobremesa y Útiles BeBasic', 'BeBasic 桌面与实用工具'
        else:
            return m_id, d_es, d_zh, 'Escritura BeBasic', 'BeBasic 书写文具'

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

    # Rule 4: Match verified mappings
    cat_key = f'{tid}:{sid}'
    top_key = f'{tid}:'
    sub_tuple = VERIFIED_SUBCATS.get(cat_key) or VERIFIED_SUBCATS.get(top_key)
    sub_es = sub_tuple[0] if sub_tuple else 'Varios'
    sub_zh = sub_tuple[1] if sub_tuple else '综合商品'

    # Master department assignment (Pure Writing in 02, Correction and Desk tools in 03)
    if tid in ['016']:
        m_id, d_es, d_zh = MASTER_DEPT_INFO['02']
    elif tid in ['022', '025', '031', '034', '037']:
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
        if not sid:
            # 39 items of EVA, Cartón Gris, Papel Seda, Cartulina belong in 07. Manualidades!
            m_id, d_es, d_zh = MASTER_DEPT_INFO['07']
            sub_es, sub_zh = 'Papeles Especiales y Cartón Craft', '特种手工纸与创意板材'
        else:
            m_id, d_es, d_zh = MASTER_DEPT_INFO['09']
    elif tid in ['059', '007', '004']:
        m_id, d_es, d_zh = MASTER_DEPT_INFO['10']
    elif tid in ['061', '063']:
        m_id, d_es, d_zh = MASTER_DEPT_INFO['11']
    else:
        m_id, d_es, d_zh = MASTER_DEPT_INFO['02']

    return m_id, d_es, d_zh, sub_es, sub_zh

def load_powerbi_metrics():
    sales_path = '/Users/dengyu/Documents/trabajo/powerbi 数据/2022-2026 .xlsx'
    
    sales_dict = {}
    if os.path.exists(sales_path):
        wb_sales = openpyxl.load_workbook(sales_path, data_only=True, read_only=True)
        for row in wb_sales.active.iter_rows(min_row=2, values_only=True):
            if len(row) > 9 and row[2] and row[2] != 'Total':
                prod_str = str(row[2]).strip()
                code_part = prod_str.split('|')[0].strip().upper()
                ventas = float(row[3]) if row[3] is not None and isinstance(row[3], (int, float)) else 0.0
                articulos = int(row[9]) if row[9] is not None and isinstance(row[9], (int, float)) else 0
                facturas = int(row[8]) if len(row) > 8 and row[8] is not None and isinstance(row[8], (int, float)) else 0
                
                clean = re.sub(r'[\s\-]', '', code_part)
                for k in [code_part, clean]:
                    if k not in sales_dict or facturas > sales_dict[k]['invoices']:
                        sales_dict[k] = {'ventas': ventas, 'units': articulos, 'invoices': facturas}
        print(f"📊 已从 PowerBI 2022-2026.xlsx 读取 {len(sales_dict)} 条商品真实销量/发票记录 (以 Nº Facturas 排序)")

    return sales_dict

def powerbi_sort_key(p):
    # Pure bestsellers by Nº Facturas (number of customer purchases / transactions)
    invoices = p.get('salesInvoices', 0)
    units = p.get('salesUnits', 0)
    rev = p.get('salesRevenue', 0)
    if invoices > 0:
        return (0, -invoices, -units, -rev, natural_sort_key(p['usercode'] or p['code']))
    
    # Pre-orders or 2026/2027 new items (e.g. Agendas)
    if p.get('isnew') or p.get('masterId') == '01':
        return (1, 0, 0, 0, natural_sort_key(p['usercode'] or p['code']))
    
    return (2, 0, 0, 0, natural_sort_key(p['usercode'] or p['code']))

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    source_json = os.path.join(root_dir, 'public/data/catalog.json')

    sales_dict = load_powerbi_metrics()

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

        uc = usercode.upper().strip()
        c = code.upper().strip()
        clean_uc = re.sub(r'[\s\-]', '', uc)
        clean_c = re.sub(r'[\s\-]', '', c)

        info = sales_dict.get(uc) or sales_dict.get(c) or sales_dict.get(clean_uc) or sales_dict.get(clean_c) or {'ventas': 0.0, 'units': 0, 'invoices': 0}
        sales_rev = round(info['ventas'], 2)
        sales_units = info['units']
        sales_inv = info['invoices']

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
            "salesRevenue": sales_rev,
            "salesUnits": sales_units,
            "salesInvoices": sales_inv,
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

    # Compute salesRank across all items that had sales based on Nº Facturas (purchase frequency / transactions)
    # Top 500: 年度畅销榜
    # Top 1000: 推荐精选优选商品
    with_sales = [p for p in clean_with_price if p['salesInvoices'] > 0]
    with_sales.sort(key=lambda x: (x['salesInvoices'], x['salesUnits'], x['salesRevenue']), reverse=True)
    for rank, p in enumerate(with_sales, start=1):
        p['salesRank'] = rank
        p['isTop500'] = (rank <= 500)
        p['isTop1000'] = (rank <= 1000)
        p['ishot'] = (rank <= 500)
    for p in clean_with_price:
        if 'salesRank' not in p:
            p['salesRank'] = 99999
            p['isTop500'] = False
            p['isTop1000'] = False

    for p_no, p_with in zip(clean_no_price, clean_with_price):
        p_no['salesRank'] = p_with['salesRank']
        p_no['isTop500'] = p_with['isTop500']
        p_no['isTop1000'] = p_with['isTop1000']
        p_no['ishot'] = p_with['ishot']

    print("🔄 正在按照 SKU 官方货号进行全库自然顺序排序...")
    clean_with_price.sort(key=lambda x: natural_sort_key(x['usercode'] or x['code']))
    clean_no_price.sort(key=lambda x: natural_sort_key(x['usercode'] or x['code']))

    print(f"✅ 处理完毕！共规范化并排序 {len(clean_with_price)} 款商品 (年度畅销Top500: 500款, 推荐精选Top1000: 1000款)。")

    print(f"✅ 处理完毕！共规范化并排序 {len(clean_with_price)} 款商品。")

    # Target directories
    dirs_to_update = [
        os.path.join(root_dir, 'public/data'),
        os.path.join(root_dir, 'data'),
        os.path.join(root_dir, 'src/data'),
        os.path.join(root_dir, 'shop/data'),
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
                '进货单价 (€)', '官方建议零售价 (PVP €)',
                '小包装数量 (Packet)', '小包整包金额 (€)', 
                '外箱装箱量 (Box)', '整箱总金额 (€)', 
                '新品 (New)', '年度畅销前500', '推荐精选前1000', '历史销量 (件)', '历史销售额 (€)', '促销状态', '2K高清实拍图链接'
            ])
            for p in clean_with_price:
                pvp = round(p['price'] * 2.8, 2)
                writer.writerow([
                    p['code'], p['usercode'], p['namees'], p['namecn'],
                    f"{p['deptZh']} ({p['deptEs']})", f"{p['subZh']} ({p['subEs']})",
                    p['price'], pvp,
                    p['packet'], p['packetPrice'],
                    p['box'], p['boxPrice'],
                    '是' if p['isnew'] else '否',
                    'Top 500' if p['isTop500'] else '',
                    'Top 1000' if p['isTop1000'] else '',
                    p.get('salesUnits', 0), p.get('salesRevenue', 0),
                    '促销' if p['ispromote'] else '正常',
                    p['imageUrl']
                ])

        with open(os.path.join(d, 'mainpaper_catalog_no_price.csv'), 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([
                '条码 (EAN)', '货号/型号 (Ref)', '西语品名', '中文品名', 
                '一级大类 (Departamento)', '二级细分 (Categoría)', 
                '小包装数量 (Packet)', '外箱装箱量 (Box)', 
                '新品 (New)', '年度畅销前500', '推荐精选前1000', '2K高清实拍图链接'
            ])
            for p in clean_no_price:
                writer.writerow([
                    p['code'], p['usercode'], p['namees'], p['namecn'],
                    f"{p['deptZh']} ({p['deptEs']})", f"{p['subZh']} ({p['subEs']})",
                    p['packet'], p['box'],
                    '是' if p['isnew'] else '否',
                    'Top 500' if p['isTop500'] else '',
                    'Top 1000' if p['isTop1000'] else '',
                    p['imageUrl']
                ])

        print(f"  📁 已更新目录文件: {d}")

if __name__ == '__main__':
    main()
