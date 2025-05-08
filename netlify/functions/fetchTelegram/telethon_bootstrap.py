import os
import json
import requests
from uuid import uuid4
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from telethon.sync import TelegramClient
from telethon.tl.types import Message, MessageMediaPhoto
import asyncio

# ✅ 루트의 .env 로드
env_path = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(dotenv_path=env_path)

# ✅ 환경변수
API_ID = os.getenv("TELEGRAM_API_ID")
API_HASH = os.getenv("TELEGRAM_API_HASH")
NETLIFY_FUNCTION_URL = os.getenv("NETLIFY_FETCH_URL")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_STORAGE_BUCKET = "telegram-images"
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

client = TelegramClient('bootstrap_session', API_ID, API_HASH)

def upload_to_supabase(file_path, dest_filename):
    with open(file_path, 'rb') as f:
        res = requests.post(
            f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_STORAGE_BUCKET}/{dest_filename}",
            headers={
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                "Content-Type": "application/octet-stream"
            },
            data=f
        )
    if res.status_code in [200, 201]:
        return f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_STORAGE_BUCKET}/{dest_filename}"
    else:
        print(f"[ERROR] Upload failed for {dest_filename}: {res.text}")
        return None

async def bootstrap_telegram_data():
    await client.start()

    with open('channels.json', 'r', encoding='utf-8') as f:
        channels = json.load(f)

    for channel in channels:
        print(f"🚀 Bootstrapping: @{channel}")
        channel_messages = []

        try:
            async for message in client.iter_messages(channel, limit=10):
                if not isinstance(message, Message):
                    continue

                media_url = None
                if isinstance(message.media, MessageMediaPhoto):
                    file_path = f"/tmp/{uuid4()}.jpg"
                    await message.download_media(file=file_path)
                    filename = f"{channel}_{message.id}_{uuid4()}.jpg".replace(" ", "_").replace("/", "_")
                    media_url = upload_to_supabase(file_path, filename)

                msg_data = {
                    "channel_id": getattr(message.peer_id, 'channel_id', None),
                    "channel_name": channel,
                    "message_id": message.id,
                    "sender_id": getattr(message.sender_id, "user_id", None),
                    "sender_username": getattr(message.sender, "username", None),
                    "is_forwarded": message.forward is not None,
                    "forwarded_from": getattr(message.forward, "from_name", None),
                    "posted_at": message.date.isoformat(),
                    "edited_at": message.edit_date.isoformat() if message.edit_date else None,
                    "content": message.message,
                    "entities": json.dumps([e.to_dict() for e in message.entities]) if message.entities else None,
                    "media": json.dumps({"type": "photo", "url": media_url}) if media_url else None,
                    "raw": message.to_json()
                }
                channel_messages.append(msg_data)

            # ✅ 채널별로 Netlify Function에 전송
            if channel_messages:
                res = requests.post(NETLIFY_FUNCTION_URL, json={"messages": channel_messages})
                print(f"✅ Sent {len(channel_messages)} messages for @{channel}: {res.status_code}")
                await asyncio.sleep(1)  # 🔄 API 제한 고려한 딜레이

        except Exception as e:
            print(f"❌ Error fetching @{channel}: {e}")
            continue

# ✅ 실행
if __name__ == "__main__":
    asyncio.run(bootstrap_telegram_data())
