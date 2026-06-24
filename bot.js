/**
 * 🎮 Minecraft Admin Bot - Advanced
 *
 * بوت ماينكرافت متقدم مع أوامر Ban/Kick
 * يتحكم من ديسكورد أو من اللعبة
 *
 * الميزات:
 * - Ban/Kick Players
 * - 24/7 Keep Alive
 * - Discord Control Panel
 * - Auto Reconnect
 * - Anti-AFK Protection
 */

const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const Discord = require('discord.js');

// ========== إعدادات ماينكرافت ==========
const MC_SERVER = {
    host: 'X1XC.aternos.me',
    port: 56576,
    username: 'AdminBot_' + Math.floor(Math.random() * 9000 + 1000),
    version: false
};
// =====================================

// ========== إعدادات ديسكورد ==========
const DISCORD = {
    token: 'YOUR_DISCORD_BOT_TOKEN',  // حط الـ Token هنا
    prefix: '!',
    adminRole: 'Admin',  // اسم الرول المسموح
    channelId: null  // حط Channel ID هنا
};
// =====================================

// ألوان
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

// حالة البوت
let mcBot;
let discordClient;
let reconnectAttempts = 0;
const MAX_RECONNECT = 100;
let isConnected = false;
let playerList = [];

// ========== دوال تسجيل ==========
function log(message, type = 'INFO') {
    const timestamp = new Date().toLocaleTimeString();
    const typeColors = {
        'MC': colors.cyan,
        'DISCORD': colors.magenta,
        'BAN': colors.red,
        'KICK': colors.yellow,
        'SUCCESS': colors.green,
        'ERROR': colors.red,
        'WARNING': colors.yellow,
        'INFO': colors.blue
    };
    const color = typeColors[type] || colors.reset;
    console.log(`${colors.cyan}[${timestamp}]${colors.reset} ${color}[${type}]${colors.reset} ${message}`);
}

// ========== بوت ماينكرافت ==========
function createMCBot() {
    log(`جاري إنشاء بوت ماينكرافت: ${MC_SERVER.username}`, 'MC');

    mcBot = mineflayer.createBot({
        host: MC_SERVER.host,
        port: MC_SERVER.port,
        username: MC_SERVER.username,
        version: MC_SERVER.version,
        hideErrors: false,
        checkTimeoutInterval: 120000
    });

    mcBot.loadPlugin(pathfinder);

    // عند الدخول
    mcBot.once('spawn', () => {
        isConnected = true;
        reconnectAttempts = 0;
        log(`✅ تم الدخول! البوت Online`, 'SUCCESS');
        log(`   السيرفر: ${MC_SERVER.host}:${MC_SERVER.port}`, 'MC');
        log(`   اللاعب: ${mcBot.username}`, 'MC');
        updatePlayerList();
        startAFKProtection();
        sendDiscordMessage(`🎮 **MC Bot is Online!**\nServer: ${MC_SERVER.host}\nPlayer: ${mcBot.username}`);
    });

    // عند سماع رسالة
    mcBot.on('chat', (username, message) => {
        log(`[CHAT] ${username}: ${message}`, 'MC');

        // تجاهل رسائل البوت
        if (username === mcBot.username) return;

        // أمر البنش من اللعبة
        if (message.startsWith('!!ban ')) {
            const target = message.slice(6).trim();
            banPlayer(target, username);
        }

        if (message.startsWith('!!kick ')) {
            const target = message.slice(7).trim();
            kickPlayer(target, username);
        }

        if (message.startsWith('!!players')) {
            const players = Object.keys(mcBot.players);
            mcBot.chat(`Players Online (${players.length}): ${players.join(', ')}`);
        }

        if (message.startsWith('!!help')) {
            mcBot.chat('Commands: !!ban <player> !!kick <player> !!players !!status');
        }

        if (message.startsWith('!!status')) {
            mcBot.chat(`Bot Status: Online ✅ | Players: ${Object.keys(mcBot.players).length}`);
        }
    });

    // عند خروج لاعب
    mcBot.on('playerLeft', (player) => {
        log(`👋 خروج اللاعب: ${player.username}`, 'MC');
        updatePlayerList();
        sendDiscordMessage(`👋 **Player Left:** ${player.username}\nOnline: ${playerList.length}`);
    });

    // عند دخول لاعب
    mcBot.on('playerJoined', (player) => {
        log(`🎉 دخول اللاعب: ${player.username}`, 'MC');
        updatePlayerList();
        sendDiscordMessage(`🎉 **Player Joined:** ${player.username}\nOnline: ${playerList.length}`);
    });

    // عند الموت
    mcBot.on('death', () => {
        log('💀 البوت موته! جاري إعادة الظهور...', 'WARNING');
        mcBot.chat('Respawning...');
    });

    // عند خطأ
    mcBot.on('error', (err) => {
        log(`خطأ: ${err.message}`, 'ERROR');
    });

    // عند قطع الاتصال
    mcBot.on('end', (reason) => {
        isConnected = false;
        log(`انقطع الاتصال: ${reason}`, 'WARNING');
        sendDiscordMessage(`⚠️ **MC Bot Disconnected!**\nReason: ${reason}`);
        handleReconnect();
    });

    mcBot.on('kicked', (reason) => {
        isConnected = false;
        log(`تم طرد البوت: ${reason}`, 'ERROR');
        sendDiscordMessage(`🚫 **Bot Kicked!**\nReason: ${reason}`);
        handleReconnect();
    });
}

// ========== أوامر الباند والكيك ==========

function banPlayer(username, admin) {
    if (!mcBot || !isConnected) {
        log('البوت ما متصل!', 'ERROR');
        return;
    }

    log(`🔨 BAN: ${username} by ${admin}`, 'BAN');

    try {
        // أمر البنش في ماينكرافت
        mcBot.chat(`/ban ${username}`);
        mcBot.chat(`Player ${username} has been banned! 🔨`);

        sendDiscordMessage(`🚫 **BAN EXECUTED**\nPlayer: ${username}\nAdmin: ${admin}\nServer: ${MC_SERVER.host}`);

        log(`✅ تم بند ${username} بنجاح`, 'SUCCESS');
    } catch (e) {
        log(`فشل بند اللاعب: ${e.message}`, 'ERROR');
    }
}

function kickPlayer(username, admin) {
    if (!mcBot || !isConnected) {
        log('البوت ما متصل!', 'ERROR');
        return;
    }

    log(`👢 KICK: ${username} by ${admin}`, 'KICK');

    try {
        // أمر الكيك في ماينكرافت
        mcBot.chat(`/kick ${username}`);
        mcBot.chat(`Player ${username} has been kicked! 👢`);

        sendDiscordMessage(`👢 **KICK EXECUTED**\nPlayer: ${username}\nAdmin: ${admin}`);

        log(`✅ تم كيك ${username} بنجاح`, 'SUCCESS');
    } catch (e) {
        log(`فشل كيك اللاعب: ${e.message}`, 'ERROR');
    }
}

function updatePlayerList() {
    if (mcBot && mcBot.players) {
        playerList = Object.keys(mcBot.players);
    }
}

// ========== حماية Anti-AFK ==========
function startAFKProtection() {
    log('بدء حماية Anti-AFK...', 'MC');

    setInterval(() => {
        if (!mcBot || !isConnected) return;

        try {
            // حركة عشوائية
            mcBot.setControlState('forward', true);
            setTimeout(() => mcBot.setControlState('forward', false), 800);

            // قفز أحياناً
            if (Math.random() > 0.5) {
                setTimeout(() => {
                    mcBot.setControlState('jump', true);
                    setTimeout(() => mcBot.setControlState('jump', false), 500);
                }, 400);
            }

            log('البوت يتحرك (Anti-AFK)', 'MC');
        } catch (e) {
            // ignore
        }
    }, 120000); // كل 2 دقيقة
}

// ========== إعادة الاتصال ==========
function handleReconnect() {
    if (reconnectAttempts >= MAX_RECONNECT) {
        log('تم الوصول للحد الأقصى من محاولات إعادة الاتصال', 'ERROR');
        sendDiscordMessage('❌ **Bot Stopped!** Max reconnect attempts reached.');
        return;
    }

    reconnectAttempts++;
    const delay = Math.min(15000 * reconnectAttempts, 60000);

    log(`جاري إعادة الاتصال خلال ${delay/1000} ثانية... (${reconnectAttempts}/${MAX_RECONNECT})`, 'WARNING');

    setTimeout(() => {
        createMCBot();
    }, delay);
}

// ========== بوت ديسكورد ==========
function createDiscordBot() {
    log('جاري إنشاء بوت ديسكورد...', 'DISCORD');

    discordClient = new Discord.Client({
        intents: [
            Discord.Intents.FLAGS.GUILDS,
            Discord.Intents.FLAGS.GUILD_MESSAGES,
            Discord.Intents.FLAGS.MESSAGE_CONTENT
        ]
    });

    discordClient.on('ready', () => {
        log(`✅ ديسكورد Bot Online: ${discordClient.user.tag}`, 'DISCORD');
    });

    // أوامر ديسكورد
    discordClient.on('messageCreate', (message) => {
        if (message.author.bot) return;
        if (!message.content.startsWith(DISCORD.prefix)) return;

        const args = message.content.slice(DISCORD.prefix.length).trim().split(' ');
        const command = args[0].toLowerCase();

        // فحص إذا المستخدم عنده صلاحية
        const hasPermission = message.member && (
            message.member.roles.cache.some(role => role.name === DISCORD.adminRole) ||
            message.member.hasPermission('ADMINISTRATOR')
        );

        switch (command) {
            case 'mcstatus':
                const statusEmbed = new Discord.MessageEmbed()
                    .setTitle('🎮 Minecraft Bot Status')
                    .setColor(isConnected ? '#00ff00' : '#ff0000')
                    .addField('Status', isConnected ? '✅ Online' : '❌ Offline')
                    .addField('Server', `${MC_SERVER.host}:${MC_SERVER.port}`)
                    .addField('Players Online', playerList.length)
                    .addField('Player List', playerList.length > 0 ? playerList.join('\n') : 'No players')
                    .addField('Uptime', `${reconnectAttempts} reconnects`);
                message.channel.send(statusEmbed);
                break;

            case 'mcplayers':
                if (!isConnected) {
                    message.reply('❌ البوت ما متصل!');
                    return;
                }
                message.reply(`🎮 اللاعبون Online (${playerList.length}):\n${playerList.join('\n') || 'لا أحد'}`);
                break;

            case 'ban':
                if (!hasPermission) {
                    message.reply('❌ ما عندك صلاحية!');
                    return;
                }
                if (!args[1]) {
                    message.reply('❌ حط اسم اللاعب!\nUsage: !ban <player_name>');
                    return;
                }
                banPlayer(args[1], message.author.tag);
                message.reply(`🚫 تم بند ${args[1]}!`);
                break;

            case 'kick':
                if (!hasPermission) {
                    message.reply('❌ ما عندك صلاحية!');
                    return;
                }
                if (!args[1]) {
                    message.reply('❌ حط اسم اللاعب!\nUsage: !kick <player_name>');
                    return;
                }
                kickPlayer(args[1], message.author.tag);
                message.reply(`👢 تم كيك ${args[1]}!`);
                break;

            case 'banlist':
                if (!isConnected) {
                    message.reply('❌ البوت ما متصل!');
                    return;
                }
                message.reply('📋 جاري جلب قائمة الباند...');
                mcBot.chat('/banlist');
                break;

            case 'help':
                const helpEmbed = new Discord.MessageEmbed()
                    .setTitle('📚 أوامر البوت')
                    .setColor('#0099ff')
                    .addField('!mcstatus', 'حالة البوت')
                    .addField('!mcplayers', 'قائمة اللاعبين')
                    .addField('!ban <name>', 'بند لاعب (للمديرين)')
                    .addField('!kick <name>', 'كيك لاعب (للمديرين)')
                    .addField('!help', 'عرض هذه القائمة')
                    .setFooter('⚠️ أوامر Ban/Kick تحتاج صلاحية Admin');
                message.channel.send(helpEmbed);
                break;

            default:
                message.reply('❌ أمر غير معروف! اكتب !help للمساعدة');
        }
    });

    discordClient.login(DISCORD.token).catch(err => {
        log(`خطأ بديسكورد: ${err.message}`, 'ERROR');
        log('البوت يشتغل بدون ديسكورد...', 'WARNING');
    });
}

function sendDiscordMessage(text) {
    if (discordClient && DISCORD.channelId) {
        const channel = discordClient.channels.cache.get(DISCORD.channelId);
        if (channel) {
            channel.send(text);
        }
    }
}

// ========== تشغيل ==========
function main() {
    console.log('╔════════════════════════════════════════╗');
    console.log('║   🎮 Minecraft Admin Bot - Advanced   ║');
    console.log('║        Ban/Kick/Keep Alive 24/7        ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('');

    // تشغيل بوت ماينكرافت
    createMCBot();

    // تشغيل بوت ديسكورد
    createDiscordBot();

    // أمر الإيقاف
    process.on('SIGINT', () => {
        log('جاري إيقاف البوت...', 'INFO');
        if (mcBot) mcBot.quit('Bot shutting down');
        if (discordClient) discordClient.destroy();
        process.exit(0);
    });
}

main();
