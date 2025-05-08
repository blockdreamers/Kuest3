import os
import json
import requests
import asyncio
from uuid import uuid4
from pathlib import Path
from dotenv import load_dotenv
from telethon.sync import TelegramClient
from telethon.tl.types import Message, MessageMediaPhoto

# ✅ .env 불러오기 (루트 기준 실행)
load_dotenv(dotenv_path=Path(".env"))

# ✅ 환경 변수
API_ID = os.getenv("TELEGRAM_API_ID")
API_HASH = os.getenv("TELEGRAM_API_HASH")
NETLIFY_FUNCTION_URL = os.getenv("NETLIFY_FETCH_URL")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_STORAGE_BUCKET = "telegram-images"
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
TELEGRAM_SESSION_URL = os.getenv("TELEGRAM_SESSION_URL")

# ✅ 세션 파일 다운로드
session_file = "telegram_fetcher_session.session"
if not Path(session_file).exists():
    if TELEGRAM_SESSION_URL:
        try:
            print(f"🌐 Downloading session file from: {TELEGRAM_SESSION_URL}")
            res = requests.get(TELEGRAM_SESSION_URL)
            if res.status_code == 200:
                with open(session_file, "wb") as f:
                    f.write(res.content)
                print(f"✅ Session file downloaded: {session_file}")
            else:
                print(f"❌ Failed to download session file: HTTP {res.status_code}")
        except Exception as e:
            print(f"❌ Error downloading session: {e}")
    else:
        print("❌ TELEGRAM_SESSION_URL is not set. Please check your .env or GitHub secrets.")
        exit(1)

# ✅ Telegram Client 초기화
client = TelegramClient(session_file, API_ID, API_HASH)

# ✅ Supabase 업로드 함수
def upload_to_supabase(file_path, dest_filename):
    try:
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
            print(f"[ERROR] Upload failed for {dest_filename}: {res.text}")
            return None
    except Exception as e:
        print(f"[EXCEPTION] During upload: {e}")
        return None

# ✅ 메시지 수집 및 Netlify 함수 전송
async def fetch_and_send_messages():
    for attempt in range(5):
        try:
            await client.start()
            break
        except Exception as e:
            print(f"⏳ Attempt {attempt + 1} to connect failed: {e}")
            await asyncio.sleep(5)
    else:
        print("❌ Failed to connect to Telegram after 5 attempts.")
        return

    # ✅ channels.json 경로를 현재 스크립트 기준으로 지정
    script_path = Path(__file__).resolve().parent
    channels_path = script_path / "channels.json"

    if not channels_path.exists():
        print(f"❌ channels.json not found at: {channels_path}")
        return

    with open(channels_path, 'r', encoding='utf-8') as f:
        channels = json.load(f)

    for channel in channels:
        print(f"\n📡 Fetching from @{channel}")
        all_messages = []
        uploaded_images = 0
        inserted = 0
        duplicate = 0

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
                    if media_url:
                        uploaded_images += 1

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

            await asyncio.sleep(1)

        except Exception as e:
            print(f"❌ Error fetching @{channel}: {e}")
            continue

        if all_messages:
            batch_size = 10
            for i in range(0, len(all_messages), batch_size):
                chunk = all_messages[i:i + batch_size]
                try:
                    res = requests.post(NETLIFY_FUNCTION_URL, json={"messages": chunk})
                    if res.status_code == 200:
                        inserted += len(chunk)
                    elif res.status_code == 409:
                        duplicate += len(chunk)
                    else:
                        print(f"[WARN] Non-200 response: {res.status_code}")
                    await asyncio.sleep(0.5)
                except Exception as e:
                    print(f"❌ Error sending batch to Netlify: {e}")
        else:
            print(f"⚠️ No messages collected from @{channel}")

        print(f"📊 Summary for @{channel} → Inserted: {inserted} | Duplicates: {duplicate} | Uploaded Images: {uploaded_images}")

# ✅ 실행
if __name__ == "__main__":
    asyncio.run(fetch_and_send_messages())
