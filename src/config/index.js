const fs = require('fs');
const path = require('path');
const dotenv = require("dotenv");
dotenv.config({ path: require("path").resolve(__dirname, "../../.env") });
const dev = {
    app: {
        port: parseInt(process.env.PORT) || 3000
    },
    db: {
        host: process.env.DB_HOST_CLOUD || 'postgres',
        user: process.env.DB_USER_CLOUD || 'myuser',
        password: process.env.DB_PASSWORD_CLOUD || 'mypassword',
        name: process.env.DB_NAME_CLOUD || 'myapp_db',
        port: parseInt(process.env.DB_PORT_CLOUD) || 5432,
        ssl: {
            ca: fs.readFileSync(path.join(__dirname, 'ca.pem')).toString(),
        },
        url: process.env.DB_URL || `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}`
    },
    redis: {
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT, // Sửa từ REDIS_PASSWORD thành REDIS_PORT
        url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST}:6379`
    },
    rabbitmq: {
        url: process.env.RABBITMQ_URL || `amqp://${process.env.RABBITMQ_HOST}:5672`
    },
    elasticsearch: {
        url: process.env.ES_URL || `http://${process.env.ES_HOST}:9200`
    },
    kafka: { // Thêm cấu hình Kafka
        broker: process.env.KAFKA_BROKER || 'kafka:9092'
    },
    expTime: parseInt(process.env.EXP_TIME) || 10000
};

const pro = {
    app: {
        port: parseInt(process.env.PORT) || 3000
    },
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT) || 5432,
        ssl: { require: true, rejectUnauthorized: false }
    },
    redis: {
        url: process.env.REDIS_URL
    },
    rabbitmq: {
        url: process.env.RABBITMQ_URL
    },
    elasticsearch: {
        url: process.env.ES_URL
    },
    kafka: { // Thêm cấu hình Kafka
        broker: process.env.KAFKA_BROKER
    },
    expTime: parseInt(process.env.EXP_TIME) || 10000
};

const config = { dev, pro };
const env = process.env.NODE_ENV || 'dev';
module.exports = config[env];