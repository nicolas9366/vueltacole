#!/usr/bin/env python3
"""
Normalize and standardize Main Paper Catalog data:
1. Map all 6,109 products into 10 Master Industry Departments and 138 clean Subcategories.
2. Fix Spanish character corruptions (ESPA?OL -> Español, CUMPLEA?OS -> Cumpleaños, etc.).
3. Split bilingual categories into clean Spanish and clean Chinese fields.
4. Regenerate all 4 manifest files in:
   - public/data/catalog.json
   - data/catalog.json
   - src/data/
   - ~/Downloads/MainPaper_2026_Catalog/
   - /Users/dengyu/CentrodeVender/MainPaper_Full_Images/
"""

import os
import json
import csv
import re

CATEGORIES_DICT = {
    # 01. Escritura y Corrección
    '016:': ('01', '✏️ Escritura y Corrección', '✏️ 书写与修正用品', 'Bolígrafos y Escritura General', '书写工具综合'),
    '016:0BA': ('01', '✏️ Escritura y Corrección', '✏️ 书写与修正用品', 'Bolígrafos Gel y Aceite', '中性笔与中油笔'),
    '016:109': ('01', '✏️ Escritura y Corrección', '✏️ 书写与修正用品', 'Bolígrafos Borrables', '可擦笔'),
    '016:14E': ('01', '✏️ Escritura y Corrección', '✏️ 书写与修正用品', 'Bolígrafos Tinta Líquida', '水性笔'),
    '016:18C': ('01', '✏️ Escritura y Corrección', '✏️ 书写与修正用品', 'Lapiceros de Grafito', '木质铅笔'),
    '016:1C1': ('01', '✏️ Escritura y Corrección', '✏️ 书写与修正用品', 'Portaminas y Minas', '自动铅笔与铅芯'),
    '016:1F4': ('01', '✏️ Escritura y Corrección', '✏️ 书写与修正用品', 'Marcadores Fluorescentes', '荧光笔'),
    '016:221': ('01', '✏️ Escritura y Corrección', '✏️ 书写与修正用品', 'Marcadores para Pizarra', '白板笔'),
    '016:24B': ('01', '✏️ Escritura y Corrección', '✏️ 书写与修正用品', 'Marcadores Permanentes', '油性记号笔'),
    '016:272': ('01', '✏️ Escritura y Corrección', '✏️ 书写与修正用品', 'Marcadores de Pintura', '油漆笔'),
    '016:293': ('01', '✏️ Escritura y Corrección', '✏️ 书写与修正用品', 'Plumas Estilográficas', '钢笔'),
    '016:2B3': ('01', '✏️ Escritura y Corrección', '✏️ 书写与修正用品', 'Bolígrafos Especiales', '特种笔'),
    '016:2D0': ('01', '✏️ Escritura y Corrección', '✏️ 书写与修正用品', 'Bolígrafos Fantasía', '创意造型笔'),
    '016:2E8': ('01', '✏️ Escritura y Corrección', '✏️ 书写与修正用品', 'Sets de Escritura', '书写文具套装'),
    '016:300': ('01', '✏️ Escritura y Corrección', '✏️ 书写与修正用品', 'Tizas y Borradores', '粉笔与板擦'),
    '022:': ('01', '✏️ Escritura y Corrección', '✏️ 书写与修正用品', 'Correctores y Cintas', '修正用品'),
    '022:0C8': ('01', '✏️ Escritura y Corrección', '✏️ 书写与修正用品', 'Cintas y Líquidos Correctores', '修正液与修正带'),
    '025:': ('01', '✏️ Escritura y Corrección', '✏️ 书写与修正用品', 'Gomas de Borrar', '橡皮'),
    '025:0C9': ('01', '✏️ Escritura y Corrección', '✏️ 书写与修正用品', 'Sacapuntas', '卷笔刀'),

    # 02. Cuadernos, Agendas y Papel
    '046:': ('02', '📓 Cuadernos, Agendas y Papel', '📓 本册、日历与纸品', 'Cuadernos Escolares', '学生本册综合'),
    '046:0CD': ('02', '📓 Cuadernos, Agendas y Papel', '📓 本册、日历与纸品', 'Cuadernos de Tapa Blanda', '软皮练习本'),
    '046:119': ('02', '📓 Cuadernos, Agendas y Papel', '📓 本册、日历与纸品', 'Cuadernos de Tapa Dura', '硬皮练习本'),
    '046:15C': ('02', '📓 Cuadernos, Agendas y Papel', '📓 本册、日历与纸品', 'Cuadernos Portugueses', '葡萄牙语练习本'),
    '046:198': ('02', '📓 Cuadernos, Agendas y Papel', '📓 本册、日历与纸品', 'Forros de Libros', '包书皮'),
    '046:1CC': ('02', '📓 Cuadernos, Agendas y Papel', '📓 本册、日历与纸品', 'Separadores de Cuaderno', '本子隔板'),
    '049:': ('02', '📓 Cuadernos, Agendas y Papel', '📓 本册、日历与纸品', 'Papel y Blocks', '纸品与活页本综合'),
    '049:0CE': ('02', '📓 Cuadernos, Agendas y Papel', '📓 本册、日历与纸品', 'Libretas de Bolsillo', '便携小笔记本'),
    '049:11A': ('02', '📓 Cuadernos, Agendas y Papel', '📓 本册、日历与纸品', 'Diarios y Agendas Personales', '日记本'),
    '049:15D': ('02', '📓 Cuadernos, Agendas y Papel', '📓 本册、日历与纸品', 'Cuadernos Creativos y Bocetos', '创意素描与设计本'),
    '049:199': ('02', '📓 Cuadernos, Agendas y Papel', '📓 本册、日历与纸品', 'Papel Especial y Dibujo', '特种纸'),
    '049:1CD': ('02', '📓 Cuadernos, Agendas y Papel', '📓 本册、日历与纸品', 'Recambios y Blocks de Carta', '活页替换芯与信纸本'),
    '049:1FE': ('02', '📓 Cuadernos, Agendas y Papel', '📓 本册、日历与纸品', 'Papel de Copia A4', '复印纸'),
    '010:': ('02', '📓 Cuadernos, Agendas y Papel', '📓 本册、日历与纸品', 'Agendas y Calendarios', '记事本与日历综合'),
    '010:110': ('02', '📓 Cuadernos, Agendas y Papel', '📓 本册、日历与纸品', 'Agenda Anual (PT)', '葡萄牙语年历本'),
    '010:155': ('02', '📓 Cuadernos, Agendas y Papel', '📓 本册、日历与纸品', 'Agenda Anual (CAT)', '加泰罗尼亚语年历本'),
    '010:193': ('02', '📓 Cuadernos, Agendas y Papel', '📓 本册、日历与纸品', 'Calendarios de Pared y Mesa (ES)', '西班牙语日历'),
    '010:1C7': ('02', '📓 Cuadernos, Agendas y Papel', '📓 本册、日历与纸品', 'Calendarios (PT)', '葡萄牙日历'),
    '010:1F9': ('02', '📓 Cuadernos, Agendas y Papel', '📓 本册、日历与纸品', 'Agenda Escolar (ES)', '西班牙语学生日程本'),
    '010:226': ('02', '📓 Cuadernos, Agendas y Papel', '📓 本册、日历与纸品', 'Agenda Escolar (PT)', '葡萄牙语学生日程本'),

    # 03. Bellas Artes y Pintura
    '053:': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'Bellas Artes General', '美术画材综合'),
    '053:0BB': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'Rotuladores Escolares', '儿童水彩笔'),
    '053:10A': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'Lápices de Dibujo y Carboncillo', '素描铅笔与炭笔'),
    '053:14F': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'Lápices de Colores', '彩色铅笔'),
    '053:18D': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'Ceras, Pasteles y Témperas', '油画棒与粉彩'),
    '053:1C2': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'Rotuladores Artísticos y Calibrados', '勾线笔与美术笔'),
    '053:1F5': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'Pintura Acuarela', '水彩颜料'),
    '053:222': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'Pintura Témpera', '水粉颜料'),
    '053:24C': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'Pintura Acrílica', '丙烯颜料'),
    '053:273': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'Pintura al Óleo', '油画颜料'),
    '053:2B4': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'Accesorios para Pintura', '颜料辅材与调色盘'),
    '053:2D1': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'Sellos Infantiles', '儿童趣味印章'),
    '053:2E9': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'Arcilla y Plastilina', '橡皮泥与陶泥'),
    '053:301': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'Sets de Pintura', '套装颜料'),
    '053:313': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'Papel Bellas Artes y Acuarela', '美术纸与水彩本'),
    '053:324': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'Caballetes y Lienzos', '画架与油画框'),
    '053:334': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'Pinceles y Paletinas', '画笔与画刷'),
    '053:344': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'Herramientas de Bellas Artes', '美术刮刀与雕塑工具'),
    '053:355': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'Accesorios de Dibujo', '绘画周边配件'),
    '053:375': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'Otras Pinturas', '其它特效颜料'),
    '013:': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'BeBasic Colección', 'BeBasic 系列'),
    '013:0C6': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'BeBasic Papelería', 'BeBasic 基础文具'),
    '013:115': ('03', '🎨 Bellas Artes y Pintura', '🎨 美术画材与颜料', 'BeBasic Bellas Artes', 'BeBasic 美术画材'),

    # 04. Manualidades, Corte y Adhesivos
    '055:': ('04', '✂️ Manualidades, Corte y Adhesivos', '✂️ 手工、胶粘与刀剪', 'Manualidades General', '手工益智综合'),
    '055:0BE': ('04', '✂️ Manualidades, Corte y Adhesivos', '✂️ 手工、胶粘与刀剪', 'Goma EVA', 'EVA 手工泡棉'),
    '055:10D': ('04', '✂️ Manualidades, Corte y Adhesivos', '✂️ 手工、胶粘与刀剪', 'Fieltro para Manualidades', '手工毛毡布'),
    '055:152': ('04', '✂️ Manualidades, Corte y Adhesivos', '✂️ 手工、胶粘与刀剪', 'Papeles Artesanales Especiales', '其它手工纸'),
    '055:190': ('04', '✂️ Manualidades, Corte y Adhesivos', '✂️ 手工、胶粘与刀剪', 'Tableros de Madera y Foam', '木板与泡沫板'),
    '055:1C4': ('04', '✂️ Manualidades, Corte y Adhesivos', '✂️ 手工、胶粘与刀剪', 'Accesorios para Manualidades', '手工配件与毛条'),
    '055:1F7': ('04', '✂️ Manualidades, Corte y Adhesivos', '✂️ 手工、胶粘与刀剪', 'Herramientas de Manualidades', '手工专用工具'),
    '055:224': ('04', '✂️ Manualidades, Corte y Adhesivos', '✂️ 手工、胶粘与刀剪', 'Papeles Artesanales en Bolsas', '袋装手工折纸'),
    '028:': ('04', '✂️ Manualidades, Corte y Adhesivos', '✂️ 手工、胶粘与刀剪', 'Adhesivos y Cintas General', '胶粘用品综合'),
    '028:0C0': ('04', '✂️ Manualidades, Corte y Adhesivos', '✂️ 手工、胶粘与刀剪', 'Pegamento Líquido', '液体胶水'),
    '028:10F': ('04', '✂️ Manualidades, Corte y Adhesivos', '✂️ 手工、胶粘与刀剪', 'Cinta Adhesiva', '胶带系列'),
    '028:154': ('04', '✂️ Manualidades, Corte y Adhesivos', '✂️ 手工、胶粘与刀剪', 'Pegamento Instantáneo', '502强力快干胶'),
    '028:192': ('04', '✂️ Manualidades, Corte y Adhesivos', '✂️ 手工、胶粘与刀剪', 'Pegatinas Decorativas', '装饰手账贴纸'),
    '028:1C6': ('04', '✂️ Manualidades, Corte y Adhesivos', '✂️ 手工、胶粘与刀剪', 'Pegatinas Autoadhesivas', '不干胶标签贴'),
    '031:': ('04', '✂️ Manualidades, Corte y Adhesivos', '✂️ 手工、胶粘与刀剪', 'Corte y Medición General', '刀剪与测量工具'),
    '031:0CA': ('04', '✂️ Manualidades, Corte y Adhesivos', '✂️ 手工、胶粘与刀剪', 'Tijeras y Cúteres', '美工刀与剪刀'),
    '031:116': ('04', '✂️ Manualidades, Corte y Adhesivos', '✂️ 手工、胶粘与刀剪', 'Lupas', '放大镜'),
    '031:15A': ('04', '✂️ Manualidades, Corte y Adhesivos', '✂️ 手工、胶粘与刀剪', 'Calculadoras', '电子计算器'),

    # 05. Carpetas, Archivo y Organización
    '051:': ('05', '📁 Carpetas, Archivo y Organización', '📁 文件收纳与装订', 'Carpetas y Archivo General', '文件管理综合'),
    '051:0C2': ('05', '📁 Carpetas, Archivo y Organización', '📁 文件收纳与装订', 'Carpetas con Fundas', '插页文件夹'),
    '051:111': ('05', '📁 Carpetas, Archivo y Organización', '📁 文件收纳与装订', 'Carpetas con Separadores', '分类索引文件夹'),
    '051:156': ('05', '📁 Carpetas, Archivo y Organización', '📁 文件收纳与装订', 'Carpetas Fuelle', '风琴收纳包'),
    '051:194': ('05', '📁 Carpetas, Archivo y Organización', '📁 文件收纳与装订', 'Fundas Multitaladro', '内页活页袋'),
    '051:1C8': ('05', '📁 Carpetas, Archivo y Organización', '📁 文件收纳与装订', 'Carpetas con Cremallera', '网格拉链袋'),
    '051:1FA': ('05', '📁 Carpetas, Archivo y Organización', '📁 文件收纳与装订', 'Carpetas con Botón', '按扣资料袋'),
    '051:227': ('05', '📁 Carpetas, Archivo y Organización', '📁 文件收纳与装订', 'Carpetas Velcro y Cuerda', '魔术扣与绳扣袋'),
    '051:251': ('05', '📁 Carpetas, Archivo y Organización', '📁 文件收纳与装订', 'Carpetas de Gomas', '绑带文件套'),
    '051:277': ('05', '📁 Carpetas, Archivo y Organización', '📁 文件收纳与装订', 'Cajas de Archivo', '档案文件盒'),
    '051:297': ('05', '📁 Carpetas, Archivo y Organización', '📁 文件收纳与装订', 'Carpetas con Pinza', '写字板夹'),
    '051:2B7': ('05', '📁 Carpetas, Archivo y Organización', '📁 文件收纳与装订', 'Carpetas Simples', '简易报告夹'),
    '034:': ('05', '📁 Carpetas, Archivo y Organización', '📁 文件收纳与装订', 'Encuadernación y Organización', '装订与收纳配件综合'),
    '034:0CB': ('05', '📁 Carpetas, Archivo y Organización', '📁 文件收纳与装订', 'Perforadoras y Quitagrapas', '打孔机与起钉器'),
    '034:117': ('05', '📁 Carpetas, Archivo y Organización', '📁 文件收纳与装订', 'Clips y Sujetapapeles', '长尾夹与票夹'),
    '034:15B': ('05', '📁 Carpetas, Archivo y Organización', '📁 文件收纳与装订', 'Pequeños Accesorios', '图钉与桌面小配件'),
    '034:197': ('05', '📁 Carpetas, Archivo y Organización', '📁 文件收纳与装订', 'Organizador de Escritorio', '笔筒与桌面收纳'),
    '034:1CB': ('05', '📁 Carpetas, Archivo y Organización', '📁 文件收纳与装订', 'Almohadillas de Sello y Tinta', '印台与印油'),
    '034:1FD': ('05', '📁 Carpetas, Archivo y Organización', '📁 文件收纳与装订', 'Alfombrillas de Escritorio', '桌面写字垫'),

    # 06. Artículos de Oficina y Comercio
    '037:': ('06', '💼 Artículos de Oficina y Comercio', '💼 办公设备与生活', 'Artículos de Oficina General', '办公及生活综合'),
    '037:0BD': ('06', '💼 Artículos de Oficina y Comercio', '💼 办公设备与生活', 'Papelería de Oficina y Tiques', '办公纸品与单据'),
    '037:10C': ('06', '💼 Artículos de Oficina y Comercio', '💼 办公设备与生活', 'Fundas para Tarjetas y Acreditación', '证件卡套与挂绳'),
    '037:151': ('06', '💼 Artículos de Oficina y Comercio', '💼 办公设备与生活', 'Pizarras y Accesorios', '白板及配件'),
    '037:18F': ('06', '💼 Artículos de Oficina y Comercio', '💼 办公设备与生活', 'Material y Máquinas de Oficina', '办公设备与塑封膜'),
    '037:24D': ('06', '💼 Artículos de Oficina y Comercio', '💼 办公设备与生活', 'Bolsas de Regalo y Compra', '礼品购物袋'),
    '040:': ('06', '💼 Artículos de Oficina y Comercio', '💼 办公设备与生活', 'Artículos Escolares Generales', '学校生活用品'),

    # 07. Mochilas, Estuches y Accesorios
    '042:': ('07', '🎒 Mochilas, Estuches y Accesorios', '🎒 箱包与笔袋', 'Mochilas y Bolsas General', '箱包笔袋综合'),
    '042:0BC': ('07', '🎒 Mochilas, Estuches y Accesorios', '🎒 箱包与笔袋', 'Portameriendas Térmicos', '保温餐包'),
    '042:10B': ('07', '🎒 Mochilas, Estuches y Accesorios', '🎒 箱包与笔袋', 'Estuches Escolares', '笔袋与文具盒'),
    '042:150': ('07', '🎒 Mochilas, Estuches y Accesorios', '🎒 箱包与笔袋', 'Mochilas de Cordones', '束口袋'),
    '042:18E': ('07', '🎒 Mochilas, Estuches y Accesorios', '🎒 箱包与笔袋', 'Identificadores de Maletas', '箱包挂件与行李牌'),

    # 08. Primeras Marcas
    '057:': ('08', '🏷️ Primeras Marcas (Bic, Milan, Pritt...)', '🏷️ 国际合作名牌', 'Primeras Marcas General', '品牌货综合'),
    '057:0C4': ('08', '🏷️ Primeras Marcas (Bic, Milan, Pritt...)', '🏷️ 国际合作名牌', 'Talens', '泰伦斯专业画材'),
    '057:113': ('08', '🏷️ Primeras Marcas (Bic, Milan, Pritt...)', '🏷️ 国际合作名牌', 'Edding', '艾丁记号笔'),
    '057:158': ('08', '🏷️ Primeras Marcas (Bic, Milan, Pritt...)', '🏷️ 国际合作名牌', 'Stabilo', '思笔乐荧光笔'),
    '057:196': ('08', '🏷️ Primeras Marcas (Bic, Milan, Pritt...)', '🏷️ 国际合作名牌', 'Pilot', '百乐中性笔'),
    '057:1CA': ('08', '🏷️ Primeras Marcas (Bic, Milan, Pritt...)', '🏷️ 国际合作名牌', 'Alpino', '阿尔皮诺儿童画材'),
    '057:1FC': ('08', '🏷️ Primeras Marcas (Bic, Milan, Pritt...)', '🏷️ 国际合作名牌', 'Staedtler', '施德楼文具'),
    '057:253': ('08', '🏷️ Primeras Marcas (Bic, Milan, Pritt...)', '🏷️ 国际合作名牌', 'Milan', '米兰精品橡皮与笔'),
    '057:279': ('08', '🏷️ Primeras Marcas (Bic, Milan, Pritt...)', '🏷️ 国际合作名牌', 'Oxford', '牛津高档练习本'),
    '057:299': ('08', '🏷️ Primeras Marcas (Bic, Milan, Pritt...)', '🏷️ 国际合作名牌', 'Bic', '比克圆珠笔'),
    '057:2B9': ('08', '🏷️ Primeras Marcas (Bic, Milan, Pritt...)', '🏷️ 国际合作名牌', 'Faber-Castell', '辉柏嘉彩铅铅笔'),
    '057:2D5': ('08', '🏷️ Primeras Marcas (Bic, Milan, Pritt...)', '🏷️ 国际合作名牌', 'Sadipal', 'Sadipal 创意纸品'),
    '057:2ED': ('08', '🏷️ Primeras Marcas (Bic, Milan, Pritt...)', '🏷️ 国际合作名牌', 'Rubio', '鲁比奥练习册'),
    '057:315': ('08', '🏷️ Primeras Marcas (Bic, Milan, Pritt...)', '🏷️ 国际合作名牌', 'Pritt', '百特固体胶'),
    '057:346': ('08', '🏷️ Primeras Marcas (Bic, Milan, Pritt...)', '🏷️ 国际合作名牌', 'Uni-Ball', '三菱日本书写笔'),
    '057:3A7': ('08', '🏷️ Primeras Marcas (Bic, Milan, Pritt...)', '🏷️ 国际合作名牌', 'Otras Marcas', '其它合作品牌'),

    # 09. Sanrio, Licencias y Tarjetas
    '059:': ('09', '🎀 Sanrio, Licencias y Tarjetas', '🎀 三丽鸥、IP与贺卡', 'Licencias y Colecciones', 'IP主题系列综合'),
    '059:195': ('09', '🎀 Sanrio, Licencias y Tarjetas', '🎀 三丽鸥、IP与贺卡', 'Serie Big Dream Girls', '追梦女孩系列'),
    '059:228': ('09', '🎀 Sanrio, Licencias y Tarjetas', '🎀 三丽鸥、IP与贺卡', 'Serie Emoji', 'Emoji 表情包系列'),
    '007:': ('09', '🎀 Sanrio, Licencias y Tarjetas', '🎀 三丽鸥、IP与贺卡', 'Tarjetas de Felicitación', '节庆贺卡'),
    '007:0D0': ('09', '🎀 Sanrio, Licencias y Tarjetas', '🎀 三丽鸥、IP与贺卡', 'Tarjetas de Ocasión', '生日与特别贺卡'),
    '004:': ('09', '🎀 Sanrio, Licencias y Tarjetas', '🎀 三丽鸥、IP与贺卡', 'Campaña Navidad y Fiestas', '圣诞与节庆专场'),

    # 10. Expositores y Muebles
    '061:': ('10', '📦 Expositores y Muebles', '📦 展架与陈列物料', 'Expositores Comerciales', '产品展架综合'),
    '061:0C7': ('10', '📦 Expositores y Muebles', '📦 展架与陈列物料', 'Expositor Vacío de Suelo', '落地空展架'),
    '063:': ('10', '📦 Expositores y Muebles', '📦 展架与陈列物料', 'Exhibición de Imagen', '形象展示物料'),
    '063:0C5': ('10', '📦 Expositores y Muebles', '📦 展架与陈列物料', 'Material Publicitario', '宣传POP物料'),
    '063:114': ('10', '📦 Expositores y Muebles', '📦 展架与陈列物料', 'Materiales Auxiliares Internos', '内需辅料与配件')
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
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    source_json = os.path.join(root_dir, 'public/data/catalog.json')
    
    with open(source_json, 'r', encoding='utf-8') as f:
        data = json.load(f)

    clean_with_price = []
    clean_no_price = []

    for p in data:
        tid = p.get('topid', '')
        sid = p.get('subid', '')
        cat_key = f'{tid}:{sid}'
        
        mapping = CATEGORIES_DICT.get(cat_key)
        if not mapping:
            mapping = ('99', '📦 Otros Productos', '📦 其它商品', 'Varios', '综合商品')

        master_id, dept_es, dept_zh, sub_es, sub_zh = mapping

        # Sanitize names
        namees = clean_text(p.get('namees', ''))
        namecn = clean_text(p.get('namecn', ''))

        # Standard clean item
        clean_item = {
            "id": str(p.get('id', '')),
            "code": str(p.get('code', '')),
            "usercode": clean_text(p.get('usercode', '')),
            "namees": namees,
            "namecn": namecn,
            "masterId": master_id,
            "deptEs": dept_es,
            "deptZh": dept_zh,
            "subEs": sub_es,
            "subZh": sub_zh,
            # Backward-compatible unified category field (clean!)
            "category": f"{sub_es} {sub_zh}",
            "topid": tid,
            "subid": sid,
            "packet": int(p.get('packet', 1)),
            "box": int(p.get('box', 1)),
            "stock": p.get('stock', 1),
            "isnew": bool(p.get('isnew', False)),
            "ishot": bool(p.get('ishot', False)),
            "ispromote": bool(p.get('ispromote', False)),
            "imageUrl": p.get('imageUrl', ''),
        }

        # With price version
        cost = float(p.get('price', 0))
        clean_with = {
            **clean_item,
            "price": cost,
            "packetPrice": round(cost * clean_item['packet'], 3),
            "boxPrice": round(cost * clean_item['box'], 3)
        }
        clean_with_price.append(clean_with)

        # No price version
        clean_no_price.append(clean_item)

    print(f"✅ 处理完毕！共规范化 {len(clean_with_price)} 款商品。")

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
