'use strict';

const fs = require('fs');
const path = require("path")
const uniqueShops = JSON.parse(fs.readFileSync(path.join(__dirname, 'unique_shops.json'), 'utf-8'));
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const users = uniqueShops.map((shop, index) => ({
            name: shop.shopName,
            email: `shop${index + 1}@example.com`, // Email giả
            password: '$2b$10$TtI.v/XoGpJc1Tws01lMOO6kc3R62F1Bvel/MqvEB.JU2T.Stna3i',
            phone: `+65${Math.floor(90000000 + Math.random() * 10000000)}`, // Số điện thoại giả
            avatar: shop.image, // Dùng image từ shop làm avatar
            balance: 0,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        await queryInterface.bulkInsert('Users', users, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Users', null, {});
    }
};