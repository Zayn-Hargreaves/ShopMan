'use strict';

const fs = require('fs');
const path = require('path');

function random_created_at() {
    const start = new Date('2025-01-01').getTime();
    const end = new Date('2025-04-27').getTime();
    const randomTime = start + (end - start) * Math.random();
    return new Date(randomTime).toISOString();
}

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            console.log('🗂 Đọc file campaigns.json, banners.json, discounts.json...');

            const campaigns = JSON.parse(fs.readFileSync(path.join(__dirname, 'campaigns.json'), 'utf-8'));
            const banners = JSON.parse(fs.readFileSync(path.join(__dirname, 'banners.json'), 'utf-8'));
            const discounts = JSON.parse(fs.readFileSync(path.join(__dirname, 'discounts.json'), 'utf-8'));

            // 1. Insert Campaigns
            if (campaigns.length > 0) {
                await queryInterface.bulkInsert('Campaigns', campaigns.map(c => ({
                    ...c,
                    createdAt: c.createdAt || random_created_at(),
                    updatedAt: c.updatedAt || random_created_at(),
                })), { transaction });
                console.log(`✅ Đã insert ${campaigns.length} Campaigns`);
            }

            // 2. Insert Banners
            if (banners.length > 0) {
                await queryInterface.bulkInsert('Banners', banners.map(b => ({
                    ...b,
                    createdAt: b.createdAt || random_created_at(),
                    updatedAt: b.updatedAt || random_created_at(),
                })), { transaction });
                console.log(`✅ Đã insert ${banners.length} Banners`);
            }

            // 3. Insert Discounts
            if (discounts.length > 0) {
                const shopRecords = await queryInterface.sequelize.query(
                    `SELECT id, name FROM "Shops"`,
                    { type: queryInterface.sequelize.QueryTypes.SELECT }
                );
                const shopNameToId = {};
                shopRecords.forEach(shop => {
                    shopNameToId[shop.name] = shop.id;
                });
                console.log(shopNameToId['HY KOREA'])
                console.log(shopNameToId['Muuv_it'])
                const discountsToInsert = discounts.map(discount => {
                    let finalShopId = null; // Default nếu là voucher của campaign

                    // Nếu voucher dành cho shop thì tách tên shop từ discount.name
                    if (discount.name.startsWith('Voucher')) {
                        const shopName = discount.name.replace('Voucher', '').trim();
                        const matchedShopId = shopNameToId[shopName];
                        if (!matchedShopId) {
                            console.warn(`⚠️ Không tìm thấy ShopId cho shop name: ${shopName}`);
                        } else {
                            finalShopId = matchedShopId;
                        }
                    } else if (discount.ShopId !== null) {
                        console.warn(`⚠️ Không xác định được Shop cho discount: ${discount.name}`);
                    }
                    console.log(finalShopId)
                    return {
                        ...discount,
                        ShopId: finalShopId,
                        createdAt: discount.createdAt || random_created_at(),
                        updatedAt: discount.updatedAt || random_created_at(),
                    };
                });

                await queryInterface.bulkInsert('Discounts', discountsToInsert, { transaction });
                console.log(`✅ Đã insert ${discounts.length} Discounts`);
            }

            await transaction.commit();
            console.log('🎉 Seeder chạy thành công!');
        } catch (err) {
            console.error('🔥 Lỗi khi chạy Seeder:', err.message);
            await transaction.rollback();
            throw err;
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Discounts', null, {});
        await queryInterface.bulkDelete('Banners', null, {});
        await queryInterface.bulkDelete('Campaigns', null, {});
        console.log('🧹 Đã rollback dữ liệu Campaigns, Banners, Discounts!');
    }
};
