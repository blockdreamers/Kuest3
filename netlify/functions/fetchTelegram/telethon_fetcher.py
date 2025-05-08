import os
import json
import requests
from uuid import uuid4
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from telethon.sync import TelegramClient
from telethon.tl.types import Message, MessageMediaPhoto

# ✅ .env 불러오기
env_path = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(dotenv_path=env_path)

# ✅ 환경 변수 로딩
API_ID = os.getenv("TELEGRAM_API_ID")
API_HASH = os.getenv("TELEGRAM_API_HASH")
NETLIFY_FUNCTION_URL = os.getenv("NETLIFY_FETCH_URL")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_STORAGE_BUCKET = "telegram-images"
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

client = TelegramClient('session', API_ID, API_HASH)

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
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_STORAGE_BUCKET}/{dest_filename}"
        print(f"✅ Uploaded to Supabase: {public_url}")
        return public_url
    else:
        print(f"[ERROR] Failed to upload {dest_filename}: {res.text}")
        return None

async def fetch_and_send_messages():
    await client.start()

    with open('channels.json', 'r', encoding='utf-8') as f:
        channels = json.load(f)

    all_messages = []

    for channel in channels:
        print(f"📡 Fetching from @{channel}")
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

                all_messages.append(msg_data)

        except Exception as e:
            print(f"❌ Error fetching @{channel}: {str(e)}")
            continue  # 다음 채널로 이동

    # ✅ Supabase로 전송
    if all_messages:
        try:
            res = requests.post(NETLIFY_FUNCTION_URL, json={"messages": all_messages})
            print(f"✅ Sent {len(all_messages)} messages: {res.status_code}")
        except Exception as e:
            print(f"❌ Error sending to Netlify function: {str(e)}")
    else:
        print("⚠️ No messages fetched.")

# ✅ 실행
import asyncio
if __name__ == "__main__":
    asyncio.run(fetch_and_send_messages())
