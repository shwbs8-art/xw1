#!/bin/bash

# ============================================
# Discord Bot Setup Script
# بوت ديسكورد - إعداد سريع
# ============================================

echo "=========================================="
echo "🤖 Discord Bot - Setup Script"
echo "=========================================="
echo ""

# طلب الـ Token
read -p "🔑 حط الـ Discord Bot Token: " TOKEN

if [ -z "$TOKEN" ]; then
    echo "❌ لازم تحط Token!"
    exit 1
fi

# إنشاء ملف .env
echo "📝 جاري إنشاء ملف .env..."
cat > .env << EOF
DISCORD_TOKEN=$TOKEN
EOF

echo "✅ تم إنشاء ملف .env"

# تثبيت المكتبات
echo ""
echo "📦 جاري تثبيت المكتبات..."
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ تم تثبيت المكتبات بنجاح!"
else
    echo "❌ صار خطأ بتثبيت المكتبات"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ الإعداد مكتمل!"
echo "=========================================="
echo ""
echo "🚀 لتشغيل البوت:"
echo "   python bot.py"
echo ""
echo "⚠️  تأكد إنك رفعت البوت على Discord Developer Portal!"
echo ""
