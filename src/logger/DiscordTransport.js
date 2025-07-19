const Transport = require('winston-transport');
const DiscordService = require('./LoggerService');

class DiscordTransport extends Transport {
    constructor(opts = {}) {
        super(opts);
        this.level = opts.level || 'error';
    }

    async log(info, callback) {
        setImmediate(() => this.emit('logged', info));
        const { level, message, ...meta } = info;
        if (level !== this.level) return;

        await DiscordService.sendEmbed({
            title: `[${level.toUpperCase()}]`,
            message,
            code: meta,
            color: level === 'error' ? 'ff0000' : '00ff00'
        });

        callback();
    }
}

module.exports = DiscordTransport;
