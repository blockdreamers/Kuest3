import os
import asyncio
from pathlib import Path
from dotenv import load_dotenv
from telethon.sync import TelegramClient
from telethon.errors import UsernameInvalidError, SessionPasswordNeededError
from supabase import create_client

# ✅ .env 불러오기
env_path = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(dotenv_path=env_path)

API_ID = os.getenv("TELEGRAM_API_ID")
API_HASH = os.getenv("TELEGRAM_API_HASH")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# ✅ 세션 파일 경로 수정 (실제 위치 반영)
session_file = str(Path(__file__).resolve().parent / "telegram_fetcher_local.session")
print(f"🗂️ Using session file: {session_file}")

# ✅ 클라이언트, Supabase 초기화
client = TelegramClient(session_file, API_ID, API_HASH)
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# ✅ 대상 채널 리스트
USERNAME_LIST = [
    "AAAAAFELb629XxplVGg9zA", "blockmedia", "BMTube", "cineking0", "cobak_alert",
    "coincodekr", "coingram_ch", "coinkcgchannel", "diglett88", "dontak00",
    "gensencoin", "jutrobedzielepsze", "liambitcoin", "minchoisfuture",
    "moneybullkr", "moneystation_best", "moon252423", "NEWS_CRYPTO_BLOCKCHAINS",
    "oddstrading2", "sepowerr", "yobeullyANN"
]

# ✅ title만 Supabase에 저장
async def fetch_and_upsert_channel_title(username):
    try:
        entity = await client.get_entity(username)
        title = getattr(entity, "title", None)

        if title:
            print(f"✅ Channel title found: @{username} → {title}")
            supabase.table("telegram_channel_avatars").upsert({
                "username": username,
                "channel_title": title
            }).execute()
            print(f"✅ Supabase upserted: @{username}")
        else:
            print(f"⚠️ No title found for @{username}")

    except UsernameInvalidError:
        print(f"❌ Invalid username: @{username}")
    except SessionPasswordNeededError:
        print(f"🔐 2FA required for @{username} (SessionPasswordNeededError)")
    except Exception as e:
        print(f"⚠️ General error for @{username}: {str(e) or 'Empty error'}")

# ✅ 실행
async def main():
    print("🚀 Starting Telegram client...")
    try:
        await client.start()
        print("✅ Telegram session started.")
    except Exception as e:
        print(f"❌ Failed to start Telegram session: {e}")
        return

    for username in USERNAME_LIST:
        print(f"\n🔍 Fetching title for @{username} ...")
        await fetch_and_upsert_channel_title(username)
        await asyncio.sleep(0.5)

if __name__ == "__main__":
    asyncio.run(main())
