const { Client, GatewayIntentBits } = require('discord.js');
const { DISCORD_TOKEN, DISCORD_LOGGER_BOT_CHANNEL } = process.env;

class LoggerService {
    constructor() {
        this.channelID = DISCORD_LOGGER_BOT_CHANNEL;
        this.isReady = false;
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });

        this.client.once('ready', () => {
            this.isReady = true;
            console.log(`[DiscordLogger] Bot ready as ${this.client.user?.tag}`);
        });

        this.client.login(DISCORD_LOGGER_BOT_TOKEN).catch(err =>
            console.error('[DiscordLogger] Login failed:', err.message)
        );
    }

    getChannel() {
        return this.client.channels.cache.get(this.channelID);
    }

    async send(message = 'No message') {
        if (!this.isReady) return;
        const channel = this.getChannel();
        if (!channel) return;
        try {
            await channel.send(message);
        } catch (err) {
            console.error('[DiscordLogger] Send failed:', err.message);
        }
    }

    async sendEmbed({ title, message, code, color = 'ff0000', language = 'json' }) {
        const embed = {
            title,
            color: parseInt(color, 16),
            description: `\`\`\`${language}\n${JSON.stringify(code, null, 2)}\n\`\`\``
        };
        await this.send({ content: message, embeds: [embed] });
    }
}

module.exports = new LoggerService();
