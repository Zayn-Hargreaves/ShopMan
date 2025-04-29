// debugProductsConsumer.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'debug-products',
  brokers: ['localhost:29092']
});

const run = async () => {
  const consumer = kafka.consumer({ groupId: 'debug-products-group' });

  await consumer.connect();
  await consumer.subscribe({ topic: 'shopman_db.public.Products', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('📥 Message:', {
        offset: message.offset,
        key: message.key?.toString(),
        value: message.value?.toString(),
      });
    },
  });
};

run().catch(console.error);
