import requests
import os

INBOX_DIR = os.path.expanduser('~/github/vueltacole/wecom_inbox')
os.makedirs(INBOX_DIR, exist_ok=True)

URL = "http://kyrmax.de/fetch_messages.php?token=obsidian2026"

print("Checking for new WeChat messages in Cloud Inbox...")
try:
    resp = requests.get(URL, timeout=10)
    if resp.status_code == 200:
        messages = resp.json()
        if not messages:
            print("No new messages.")
        for msg in messages:
            filename = os.path.join(INBOX_DIR, msg['file'])
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(msg['content'])
            print(f"Downloaded: {filename}")
    else:
        print("Error from server:", resp.status_code, resp.text)
except Exception as e:
    print("Connection error:", e)
