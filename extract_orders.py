import Quartz
import Vision
from Foundation import NSURL
import time
import subprocess
import re
import csv
import sys

def recognize_text(image_path):
    url = NSURL.fileURLWithPath_(image_path)
    request = Vision.VNRecognizeTextRequest.alloc().init()
    request.setRecognitionLevel_(Vision.VNRequestTextRecognitionLevelAccurate)
    request.setUsesLanguageCorrection_(True)
    request.setRecognitionLanguages_(["zh-Hans", "en-US"])
    
    handler = Vision.VNImageRequestHandler.alloc().initWithURL_options_(url, None)
    success, error = handler.performRequests_error_([request], None)
    
    if success:
        return [res.topCandidates_(1)[0].string() for res in request.results()]
    else:
        return []

def scroll():
    x, y = 170, 400
    event = Quartz.CGEventCreateMouseEvent(None, Quartz.kCGEventMouseMoved, (x, y), Quartz.kCGMouseButtonLeft)
    Quartz.CGEventPost(Quartz.kCGHIDEventTap, event)
    time.sleep(0.05)
    scroll_event = Quartz.CGEventCreateScrollWheelEvent(None, Quartz.kCGScrollEventUnitLine, 1, -25)
    Quartz.CGEventPost(Quartz.kCGHIDEventTap, scroll_event)
    time.sleep(1.0) # wait for render

def parse_lines(lines):
    orders = []
    current_order = {}
    
    id_re = re.compile(r'^(\d{6,8})[>〉]$')
    date_re = re.compile(r'(202\d-\d\d-\d\d \d\d:\d\d:\d\d)')
    source_re = re.compile(r'(销售端|客户端|管理端|友购平板|业务端|小程序|后台)[^\w]*([a-zA-Z0-9]+)')
    amount_re = re.compile(r'^[\d,]+\.\d{2}$|^\d+,\d+$')
    status_re = re.compile(r'^(开票中|已取消|配货中|运输中|待确认|已发货|已完成|部分发货|退货中|已签收|合并配货|配货完成)$')
    
    for line in lines:
        line = line.strip()
        if not line: continue
        
        m_id = id_re.match(line)
        if m_id:
            if current_order and 'id' in current_order:
                orders.append(current_order)
            current_order = {'id': m_id.group(1)}
            continue
            
        if not current_order:
            continue
            
        if 'name' not in current_order:
            if len(line) > 1 and not line.isdigit() and line not in ['G','P','Z','L','Ho']:
                current_order['name'] = line
                continue
                
        m_date = date_re.search(line)
        if m_date:
            current_order['date'] = m_date.group(1)
            
        m_source = source_re.search(line)
        if m_source:
            current_order['source'] = m_source.group(1)
            current_order['order_no'] = m_source.group(2)
            
        m_amount = amount_re.match(line)
        if m_amount:
            current_order['amount'] = line
            
        m_status = status_re.match(line)
        if m_status:
            current_order['status'] = line
            
    if current_order and 'id' in current_order:
        orders.append(current_order)
        
    return orders

def main():
    subprocess.run(["open", "-a", "Mainpaper Sales"])
    time.sleep(2)
    
    max_scrolls = 80
    extracted_orders = {}
    csv_file = '/Users/dengyu/github/vueltacole/orders_2026.csv'
    image_path = '/tmp/mpsales_current.png'
    
    fields = ['id', 'name', 'source', 'order_no', 'date', 'amount', 'status']
    
    with open(csv_file, 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        
    last_texts = []
    
    for i in range(max_scrolls):
        print(f"Scroll iteration {i+1}/{max_scrolls}...")
        subprocess.run(["screencapture", "-x", image_path])
        lines = recognize_text(image_path)
        text_joined = "\n".join(lines)
        
        if text_joined in last_texts:
            print("No change in screen detected. We might have reached the end.")
            break
        last_texts.append(text_joined)
        if len(last_texts) > 3:
            last_texts.pop(0)
            
        new_orders = parse_lines(lines)
        
        added = 0
        with open(csv_file, 'a', encoding='utf-8-sig', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fields)
            for o in new_orders:
                key = o.get('order_no')
                if not key:
                    key = o.get('id', '') + o.get('date', '')
                if not key:
                    continue
                    
                if key not in extracted_orders:
                    extracted_orders[key] = o
                    writer.writerow({f: o.get(f, '') for f in fields})
                    added += 1
                    
        print(f"Extracted {added} new orders in this screen. Total unique: {len(extracted_orders)}")
        sys.stdout.flush()
        
        hit_2025 = any('2025-' in line for line in lines)
        if hit_2025:
            print("Reached 2025 orders. Stopping.")
            break
            
        scroll()
        
    print(f"Data extraction complete! Saved to {csv_file}")

if __name__ == "__main__":
    main()
