import os
import asyncio
import requests
from pathlib import Path
from dotenv import load_dotenv
from telethon.sync import TelegramClient
from telethon.errors import UsernameInvalidError
from supabase import create_client

# ✅ 환경 설정
env_path = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(dotenv_path=env_path)

API_ID = os.getenv("TELEGRAM_API_ID")
API_HASH = os.getenv("TELEGRAM_API_HASH")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_STORAGE_BUCKET = "telegram-avartar"

# ✅ 세션 설정
session_file = "telegram_fetcher_local.session"
client = TelegramClient(session_file, API_ID, API_HASH)

# ✅ Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# ✅ 채널 리스트
USERNAME_LIST = [
    "AAAAAFELb629XxplVGg9zA", "blockmedia", "BMTube", "cineking0", "cobak_alert",
    "coincodekr", "coingram_ch", "coinkcgchannel", "diglett88", "dontak00",
    "gensencoin", "jutrobedzielepsze", "liambitcoin", "minchoisfuture",
    "moneybullkr", "moneystation_best", "moon252423", "NEWS_CRYPTO_BLOCKCHAINS",
    "oddstrading2", "sepowerr", "yobeullyANN"
]

# ✅ Supabase에 이미지 업로드 (409 Conflict는 무시)
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
            print(f"✅ Uploaded: {dest_filename}")
        elif res.status_code == 409:
            print(f"⚠️ Already exists: {dest_filename} (skipping upload)")
        else:
            print(f"[ERROR] Failed to upload {dest_filename}: {res.text}")
    except Exception as e:
        print(f"[EXCEPTION] Upload error for {dest_filename}: {e}")

# ✅ 아바타 및 채널명 수집 → Supabase upsert
async def fetch_and_upsert_channel_info(username):
    try:
        entity = await client.get_entity(username)
        title = getattr(entity, 'title', username)
        avatar_filename = f"{username}_avatar.jpg"
        avatar_url = f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_STORAGE_BUCKET}/{avatar_filename}"

        # ✅ 아바타 다운로드 및 업로드 (존재 시 업로드 건너뜀)
        file_path = f"/tmp/{avatar_filename}"
        try:
            await client.download_profile_photo(entity, file=file_path)
            upload_to_supabase(file_path, avatar_filename)
        except Exception as e:
            print(f"⚠️ Avatar download/upload skipped for @{username}: {e}")

        # ✅ Supabase 업서트
        res = supabase.table("telegram_channel_avatars").upsert({
            "username": username,
            "channel_title": title,
            "avatar_url": avatar_url
        }).execute()
        print(f"✅ Upserted channel: {title} (@{username})")

    except UsernameInvalidError:
        print(f"❌ Invalid username: @{username}")
    except Exception as e:
        print(f"⚠️ General error for @{username}: {e}")

# ✅ 실행
async def main():
    try:
        await client.start()
    except Exception as e:
        print(f"⏳ Telegram start failed: {e}")
        return

    for username in USERNAME_LIST:
        print(f"\n🔍 Processing @{username} ...")
        await fetch_and_upsert_channel_info(username)
        await asyncio.sleep(0.5)

if __name__ == "__main__":
    asyncio.run(main())
