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

# ✅ 세션 파일 경로
session_file = Path(__file__).parent / "telegram_fetcher_local.session"
print(f"🗂️ Using session file: {session_file.resolve()}")

# ✅ Telegram client
client = TelegramClient(str(session_file), API_ID, API_HASH)

# ✅ Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# ✅ Storage 업로드 함수
def upload_to_supabase(file_path, dest_filename):
    public_url = f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_STORAGE_BUCKET}/{dest_filename}"
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
            print(f"✅ Uploaded new file: {dest_filename}")
        elif res.status_code == 409:
            print(f"⚠️ File already exists: {dest_filename}, skipping upload")
        else:
            print(f"❌ Upload failed with status {res.status_code}: {res.text}")
            return None
        return public_url
    except Exception as e:
        print(f"❌ Upload exception: {e}")
        return None

# ✅ 아바타 수집 및 DB 업데이트
async def process_missing_avatar(username):
    print(f"\n🔍 Fetching avatar for @{username}")
    try:
        entity = await client.get_entity(username)
        filename = f"{username}_avatar.jpg"
        local_path = f"/tmp/{filename}"
        avatar_url = f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_STORAGE_BUCKET}/{filename}"

        try:
            await client.download_profile_photo(entity, file=local_path)
            upload_to_supabase(local_path, filename)
        except Exception as e:
            print(f"⚠️ Avatar download skipped for @{username}: {e}")

        # ✅ avatar_url 강제 업데이트
        supabase.table("telegram_channel_avatars").update({
            "avatar_url": avatar_url
        }).eq("username", username).execute()
        print(f"✅ Updated DB avatar_url for @{username}")

    except UsernameInvalidError:
        print(f"❌ Invalid username: @{username}")
    except Exception as e:
        print(f"⚠️ General error for @{username}: {e if str(e) else '{}'}")

# ✅ 실행
async def main():
    await client.start()
    print("🚀 Telegram client started.")

    # ✅ avatar_url이 null인 채널 조회
    response = supabase.from_("telegram_channel_avatars").select("username").is_("avatar_url", None).execute()
    usernames = [row["username"] for row in response.data]

    print(f"\n🔧 Found {len(usernames)} missing avatars.")
    for username in usernames:
        await process_missing_avatar(username)
        await asyncio.sleep(0.4)

if __name__ == "__main__":
    asyncio.run(main())
