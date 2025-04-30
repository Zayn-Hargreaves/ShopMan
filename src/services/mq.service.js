// services/mq.service.js
const amqp = require('amqplib');
let _channel = null;
const rabbitmqUrl = process.env.RABBITMQ_URL
async function getChannel() {
    if (_channel) return _channel;
    const connection = await amqp.connect(rabbitmqUrl);
    _channel = await connection.createChannel();
    return _channel;
}

async function publish(queue, message) {
    const channel = await getChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
    });
    console.log(`✅ Message sent to queue [${queue}]`, message);
}

module.exports = { publish };
