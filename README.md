# 🤖 Discord Bot - Online 24/7

بوت ديسكورد مبرمج عشان يكون Online 24/7 بدون ما يطفي!

## 📋 المتطلبات

- Python 3.8+
- حساب Discord Developer
- Token للبوت

## 🚀 طريقة التشغيل المحلي

```bash
# 1. تثبيت المكتبات
pip install -r requirements.txt

# 2. حط الـ Token
export DISCORD_TOKEN="your-bot-token-here"

# 3. تشغيل البوت
python bot.py
```

## ☁️ طريقة التشغيل 24/7 (مجاني)

### الخيار 1: Railway.app (موصى به) ⭐

1. روح لـ https://railway.app
2. سجل دخول بـ GitHub
3. اضغط **New Project** → **Deploy from GitHub**
4. ارفع المشروع على GitHub
5. حط `DISCORD_TOKEN` في Environment Variables
6. اضغط **Deploy** - البوت يصير online!

### الخيار 2: Render.com

1. روح لـ https://render.com
2. سجل دخول
3. اضغط **New** → **Web Service**
4. اربط GitHub repo
5. حط:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python bot.py`
6. حط `DISCORD_TOKEN` في Environment
7. **Important:** غيّر Plan إلى **Free** واحط:
   - **Health Check Path:** `/`
   - **Auto-Deploy:** Yes

### الخيار 3: Replit + UptimeRobot

1. روح لـ https://replit.com
2. أنشئ Repl جديد
3. ارفع الكود
4. حط Token في Secrets
5. تشغيل البوت
6. روح لـ https://uptimerobot.com
7. أنشئ monitoring مجاني
8. حط رابط Replit (مثل: `https://your-bot.username.repl.co`)
9. UptimeRobot يطلّع request كل 5 دقائق وياه البوت يضل alive

### الخيار 4: Discord VPS (أفضل خيار)

```bash
# على Ubuntu/Debian VPS
sudo apt update
sudo apt install python3 python3-pip git

# نسخ المشروع
git clone https://github.com/your-repo/discord-bot.git
cd discord-bot

# تثبيت
pip3 install -r requirements.txt

# تشغيل بـ screen (يضل شغال حتى لو سكرت الطرفية)
screen -S discord-bot
python3 bot.py
# اضغط Ctrl+A ثم D للخرج

# إعادة الدخول للبوت
screen -r discord-bot
```

## 🔧 إعداد البوت على Discord

1. روح لـ https://discord.com/developers/applications
2. اضغط **New Application**
3. روح لـ **Bot** → **Add Bot**
4. نسخ الـ **Token** (احفظه! ما تشاركه مع أحد)
5. تفعيل **Message Content Intent** في قسم **Privileged Gateway Intents**
6. تفعيل **Server Members Intent**

## 📝 رابط دعوة البوت

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot
```

استبدل `YOUR_CLIENT_ID` بـ Application ID من صفحة البوت.

## 📁 هيكل المشروع

```
discord_bot/
├── bot.py           # الكود الرئيسي
├── requirements.txt # المكتبات
├── README.md        # هذا الملف
└── .env             # حط الـ Token هنا (ما ترفعه على GitHub!)
```

## ⚠️ نصائح مهمة

1. **ما ترفع الـ Token على GitHub!** - حطه بـ Environment Variables
2. **ما تخلي البوت Admin** - استخدم الصلاحيات اللي تحتاجها بس
3. **راقب الـ logs** - عشان تعرف إذا صار خطأ
4. **استخدم replit/nologs** - إذا تبي تخلي البوت ساكت

## 🎮 أوامر البوت

| الأمر | الوظيفة |
|-------|---------|
| `!ping` | فحص سرعة البوت |
| `!help` | قائمة الأوامر |
| `!status` | حالة البوت |
| `!server` | معلومات السيرفر |
| `!clear [عدد]` | مسح رسائل (للمديرين) |
| `!about` | عن البوت |

## 📞 المساعدة

إذا عندك أي سؤال، إسألني!
