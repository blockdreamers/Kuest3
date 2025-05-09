import os
import asyncio
import requests  # ✅ 이 줄 추가
from pathlib import Path
from dotenv import load_dotenv
from telethon.sync import TelegramClient
from telethon.errors import UsernameInvalidError

# ✅ 환경설정
env_path = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(dotenv_path=env_path)

API_ID = os.getenv("TELEGRAM_API_ID")
API_HASH = os.getenv("TELEGRAM_API_HASH")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_STORAGE_BUCKET = "telegram-avartar"  # ✅ 버킷명 수정
TELEGRAM_SESSION_URL = os.getenv("TELEGRAM_SESSION_URL")

session_file = "telegram_fetcher_session.session"
client = TelegramClient(session_file, API_ID, API_HASH)

# ✅ 업로드 함수
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
            print(f"[ERROR] Failed to upload {dest_filename}: {res.text}")
            return None
    except Exception as e:
        print(f"[EXCEPTION] During upload: {e}")
        return None

# ✅ 수집 대상 채널
USERNAME_LIST = [
    "AAAAAFELb629XxplVGg9zA", "blockmedia", "BMTube", "cineking0", "cobak_alert",
    "coincodekr", "coingram_ch", "coinkcgchannel", "diglett88", "dontak00",
    "gensencoin", "jutrobedzielepsze", "liambitcoin", "minchoisfuture",
    "moneybullkr", "moneystation_best", "moon252423", "NEWS_CRYPTO_BLOCKCHAINS",
    "oddstrading2", "sepowerr", "yobeullyANN"
]

# ✅ 아바타 수집
async def fetch_channel_avatar(channel_username):
    try:
        entity = await client.get_entity(channel_username)
        file_path = f"/tmp/{channel_username}_avatar.jpg"
        await client.download_profile_photo(entity, file=file_path)
        dest_filename = f"{channel_username}_avatar.jpg"
        url = upload_to_supabase(file_path, dest_filename)
        return url
    except UsernameInvalidError:
        print(f"❌ Invalid username: {channel_username}")
        return None
    except Exception as e:
        print(f"⚠️ Error fetching avatar for @{channel_username}: {e}")
        return None

# ✅ 실행 루프
async def main():
    await client.start()
    for username in USERNAME_LIST:
        print(f"📸 Fetching avatar for @{username}")
        avatar_url = await fetch_channel_avatar(username)
        if avatar_url:
            print(f"✅ Uploaded: {avatar_url}")
        await asyncio.sleep(0.5)  # 너무 빠른 요청 방지

if __name__ == "__main__":
    asyncio.run(main())
