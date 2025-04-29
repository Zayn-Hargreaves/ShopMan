'use strict';
const fs = require('fs');
const path = require('path');

const uniqueShops = JSON.parse(fs.readFileSync(path.join(__dirname, 'unique_shops.json'), 'utf-8'));

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Lấy ID của role 'seller'
    const roles = await queryInterface.sequelize.query(
      `SELECT id FROM "Roles" WHERE role_name = 'seller'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    if (!roles.length) throw new Error('Role "seller" not found');
    const roleId = roles[0].id;

    // Lấy tất cả user
    let users = await queryInterface.sequelize.query(
      `SELECT id, email FROM "Users"`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Nếu không đủ user, tạo user giả
    if (users.length < uniqueShops.length) {
      const dummyUsers = Array(uniqueShops.length - users.length)
        .fill()
        .map((_, i) => ({
          email: `dummy${i + users.length + 1}@example.com`,
          password: '$2b$10$TtI.v/XoGpJc1Tws01lMOO6kc3R62F1Bvel/MqvEB.JU2T.Stna3i', // Mật khẩu đã băm
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
      await queryInterface.bulkInsert('Users', dummyUsers);
      users = await queryInterface.sequelize.query(
        `SELECT id, email FROM "Users"`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
    }

    // Ánh xạ shop, thêm slug
    const shops = uniqueShops.map((shop, index) => ({
      UserId: users[index % users.length].id,
      name: shop.shopName,
      balance: 0,
      status: shop.status === 'active' ? 'pending' : shop.status,
      RolesId: roleId,
      shopLocation: shop.shopLocation || 'No location provided',
      logo: shop.image,
      rating: 4.5,
      desc: `Shop ${shop.shopName} located in ${shop.shopLocation || 'unknown'}`,
      slug: shop.shopName.toLowerCase().replace(/ /g, '-'), // Tạo slug từ shopName
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('Shops', shops, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Shops', null, {});
  },
};