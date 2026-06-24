"""
Discord Bot - Online 24/7
بوت ديسكورد يصير online ويضل شغال
"""

import discord
from discord.ext import commands, tasks
import asyncio
import os
from datetime import datetime

# إعداد البوت
intents = discord.Intents.all()
intents.message_content = True

bot = commands.Bot(command_prefix="!", intents=intents)

# Status اللي يظهر بالبوت
@bot.event
async def on_ready():
    print(f"✅ البوت شغال: {bot.user}")
    print(f"✅ الوقت: {datetime.now()}")

    # وضعيات مختلفة للبوت (يتغير كل فترة)
    status_task.start()

    # جيب قناة معينة وحط رسالة
    for guild in bot.guilds:
        print(f"   📁 Server: {guild.name}")

# Task يغير status كل فترة (يخلي البوت "alive")
@tasks.loop(minutes=5)
async def status_task():
    statuses = [
        "Online 24/7 🤖",
        "!help للمساعدة",
        "بوت متصل ✓",
        f"مع {len(bot.guilds)} سيرفر",
    ]
    status = statuses[int(datetime.now().timestamp()) % len(statuses)]
    await bot.change_presence(activity=discord.Game(name=status))

# أمر ping - فحص البوت
@bot.command(name="ping")
async def ping(ctx):
    latency = round(bot.latency * 1000)
    embed = discord.Embed(
        title="🏓 Pong!",
        description=f"**Latency:** {latency}ms",
        color=discord.Color.green()
    )
    await ctx.send(embed=embed)

# أمر help
@bot.command(name="help")
async def help_command(ctx):
    embed = discord.Embed(
        title="📚 أوامر البوت",
        description=" قائمة الأوامر المتاحة:",
        color=discord.Color.blue()
    )
    embed.add_field(name="!ping", value="فحص سرعة البوت", inline=False)
    embed.add_field(name="!status", value="حالة البوت", inline=False)
    embed.add_field(name="!server", value="معلومات السيرفر", inline=False)
    embed.add_field(name="!clear [عدد]", value="مسح رسائل", inline=False)
    await ctx.send(embed=embed)

# أمر status
@bot.command(name="status")
async def status_command(ctx):
    embed = discord.Embed(
        title="📊 حالة البوت",
        description=f"**البوت:** Online ✅\n**السيرفرات:** {len(bot.guilds)}\n**الأونلاين من:** <t:1700000000:R>",
        color=discord.Color.green()
    )
    await ctx.send(embed=embed)

# أمر معلومات السيرفر
@bot.command(name="server")
async def server_info(ctx):
    guild = ctx.guild
    embed = discord.Embed(
        title=f"📁 {guild.name}",
        color=discord.Color.purple()
    )
    embed.add_field(name="الأعضاء", value=guild.member_count, inline=True)
    embed.add_field(name="الرومات", value=len(guild.channels), inline=True)
    embed.add_field(name="الأدوار", value=len(guild.roles), inline=True)
    if guild.icon:
        embed.set_thumbnail(url=guild.icon.url)
    await ctx.send(embed=embed)

# أمر مسح الرسائل (للمسؤولين)
@bot.command(name="clear")
@commands.has_permissions(manage_messages=True)
async def clear_messages(ctx, amount: int = 5):
    if amount > 100:
        amount = 100
    await ctx.channel.purge(limit=amount + 1)
    await ctx.send(f"✅ تم مسح {amount} رسالة!", delete_after=3)

# رسالة دخول عضو جديد
@bot.event
async def on_member_join(member):
    channel = discord.utils.get(member.guild.text_channels, name="welcome")
    if channel:
        embed = discord.Embed(
            title=f"🎉 أهلاً {member.name}!",
            description=f"مرحباً بك في {member.guild.name}",
            color=discord.Color.green()
        )
        await channel.send(embed=embed)

# أمر about
@bot.command(name="about")
async def about_command(ctx):
    embed = discord.Embed(
        title="🤖 عن البوت",
        description="بوت ديسكورد مبرمج عشان يكون Online 24/7",
        color=discord.Color.blurple()
    )
    embed.add_field(name="المبرمج", value="MiniMax Agent", inline=True)
    embed.add_field(name="الإصدار", value="1.0.0", inline=True)
    await ctx.send(embed=embed)

# Error handling
@bot.event
async def on_command_error(ctx, error):
    if isinstance(error, commands.CommandNotFound):
        await ctx.send("❌ هذا الأمر غير موجود!")
    elif isinstance(error, commands.MissingPermissions):
        await ctx.send("❌ ما عندك صلاحية!")
    else:
        await ctx.send(f"❌ خطأ: {error}")

# تشغيل البوت
if __name__ == "__main__":
    # إحط الـ Token هنا أو من متغير البيئة
    TOKEN = os.getenv("DISCORD_TOKEN") or "YOUR_DISCORD_TOKEN_HERE"

    if TOKEN == "YOUR_DISCORD_TOKEN_HERE":
        print("⚠️  IMPORTANTE: حط الـ Token بالمتغير DISCORD_TOKEN أو غيّر السطر أعلاه!")
    else:
        print("🚀 جاري تشغيل البوت...")
        bot.run(TOKEN)
