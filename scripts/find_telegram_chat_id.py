#!/usr/bin/env python3
"""
Утилита для получения CHAT_ID пользователя @lanaknyazevaschool.

ИНСТРУКЦИЯ:
1. Создайте бота через @BotFather → получите BOT_TOKEN
2. Пользователь @lanaknyazevaschool должен отправить этому боту ЛЮБОЕ сообщение
   (или /start) — иначе бот не сможет ему писать
3. Запустите этот скрипт:
       python3 find_telegram_chat_id.py ВАШ_BOT_TOKEN
4. Скрипт выведет chat_id — вставьте его в index.html в TELEGRAM_CONFIG.CHAT_ID
"""
import sys
import json
import urllib.request

def main():
    if len(sys.argv) < 2:
        print("Использование: python3 find_telegram_chat_id.py <BOT_TOKEN>")
        print("Пример:    python3 find_telegram_chat_id.py 7123456789:AAH-xyz...")
        sys.exit(1)

    token = sys.argv[1].strip()
    url = f"https://api.telegram.org/bot{token}/getUpdates"

    try:
        with urllib.request.urlopen(url, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"Ошибка запроса: {e}")
        sys.exit(1)

    if not data.get("ok"):
        print(f"Telegram API вернул ошибку: {data}")
        sys.exit(1)

    updates = data.get("result", [])
    if not updates:
        print("Нет обновлений.")
        print("Убедитесь, что @lanaknyazevaschool отправил боту хотя бы одно сообщение,")
        print("затем запустите скрипт снова.")
        sys.exit(0)

    seen = {}
    for u in updates:
        msg = u.get("message") or u.get("channel_post") or u.get("edited_message")
        if not msg:
            continue
        chat = msg.get("chat", {})
        cid = chat.get("id")
        uname = chat.get("username") or chat.get("first_name") or chat.get("title") or "?"
        if cid is not None and cid not in seen:
            seen[cid] = uname

    if not seen:
        print("Не найдено chat_id в обновлениях.")
        sys.exit(0)

    print("=" * 50)
    print(" Найденные chat_id:")
    print("=" * 50)
    for cid, uname in seen.items():
        print(f"  username/name : @{uname}" if not str(uname).startswith("-") else f"  channel       : {uname}")
        print(f"  chat_id       : {cid}")
        print("-" * 50)
    print("\nВставьте нужный chat_id в index.html:")
    print('  TELEGRAM_CONFIG.CHAT_ID = "<выбранный_chat_id>"')

if __name__ == "__main__":
    main()
