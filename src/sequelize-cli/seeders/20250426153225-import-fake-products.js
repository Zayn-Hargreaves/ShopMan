'use strict';

const fs = require('fs');
const path = require('path');

function random_created_at() {
  const start = new Date('2025-01-01').getTime();
  const end = new Date('2025-04-27').getTime();
  const randomTime = new Date(start + Math.random() * (end - start));
  return randomTime.toISOString();
}

function buildCategoryPath(categoryId, categoriesMap) {
  let path = [];
  let current = categoriesMap[categoryId];
  while (current) {
    path.unshift(current.id);
    current = categoriesMap[current.parentId];
  }
  return path;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      console.log('🗂 Đọc file merged.json...');
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'merged.json'), 'utf-8'));

      console.log('🗂 Đọc file organized_categories.json...');
      const categories = JSON.parse(fs.readFileSync(path.join(__dirname, 'organized_categories.json'), 'utf-8'));

      console.log('🗂 Đọc file unique_shops.json...');
      const shops = JSON.parse(fs.readFileSync(path.join(__dirname, 'unique_shops.json'), 'utf-8'));

      // Map catid -> category name
      const catidToName = {};
      categories.forEach(parent => {
        if (Array.isArray(parent.children)) {
          parent.children.forEach(child => {
            if (child.catid && child.name) {
              catidToName[child.catid] = child.name;
            }
          });
        }
      });
      const categoryIdToParentMap = {};
      categories.forEach(parent => {
        if (Array.isArray(parent.children)) {
          parent.children.forEach(child => {
            categoryIdToParentMap[child.catid] = { id: child.catid, parentId: parent.catid };
          });
        }
      });


      // Map shopid -> shop name
      const shopidToName = {};
      shops.forEach(shop => {
        if (shop.shopid && shop.shopName) {
          shopidToName[shop.shopid] = shop.shopName;
        }
      });

      // Fetch categories and shops
      const categoryRecords = await queryInterface.sequelize.query(
        `SELECT id, name FROM "Categories"`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      const categoryNameToId = {};
      categoryRecords.forEach(cat => {
        categoryNameToId[cat.name] = cat.id;
      });

      const shopRecords = await queryInterface.sequelize.query(
        `SELECT id, name FROM "Shops"`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      const shopNameToId = {};
      shopRecords.forEach(shop => {
        shopNameToId[shop.name] = shop.id;
      });

      // --------------------
      // Insert Products
      // --------------------
      const productsData = [];

      for (const product of data.Products) {
        const originalCatId = product.CategoryId;
        const categoryName = catidToName[originalCatId];
        const newCategoryId = categoryNameToId[categoryName] || categoryRecords[0].id;

        // 👉 Sửa đoạn này:
        const categoryPath = await queryInterface.sequelize.query(
          `
    WITH RECURSIVE category_tree AS (
      SELECT id, "ParentId"
      FROM "Categories"
      WHERE id = :categoryId

      UNION ALL

      SELECT c.id, c."ParentId"
      FROM "Categories" c
      INNER JOIN category_tree ct ON c.id = ct."ParentId"
    )
    SELECT id FROM category_tree ORDER BY id ASC;
    `,
          {
            type: queryInterface.sequelize.QueryTypes.SELECT,
            replacements: { categoryId: newCategoryId }
          }
        );

        productsData.push({
          id: product.id,
          name: product.name,
          desc: product.desc,
          desc_plain: product.desc_plain,
          price: product.price,
          discount_percentage: product.discount_percentage,
          thumb: product.thumb,
          attrs: product.attrs ? JSON.stringify(product.attrs) : '{}',
          status: product.status || 'active',
          slug: product.slug || (product.name.toLowerCase().replace(/ /g, "-")),
          CategoryId: newCategoryId,
          sort: product.sort || 0,
          ShopId: shopNameToId[shopidToName[product.ShopId]] || shopRecords[0].id,
          rating: 4.5,
          CategoryPath: categoryPath.map(c => c.id),
          sale_count: product.sale_count || 0,
          has_variations: product.has_variations || false,
          createdAt: random_created_at(),
          updatedAt: random_created_at(),
        });
      }





      // 👉 Log id nào vượt quá INTEGER
      productsData.forEach(p => {
        if (p.id > 2147483647) {
          console.error('🚨 Product ID vượt giới hạn INTEGER:', p.id);
        }
      });

      await queryInterface.bulkInsert('Products', productsData, { transaction });
      console.log(`✅ Đã insert ${productsData.length} Products`);

      // --------------------
      // Insert Skus
      // --------------------
      const skusData = data.Sku.map(sku => ({
        id: sku.id,
        sku_no: sku.sku_no,
        sku_name: sku.sku_name || null,
        sku_desc: sku.sku_desc || null,
        sku_type: sku.sku_type || null,
        status: sku.status || 'active',
        sort: sku.sort || 0,
        sku_stock: sku.sku_stock || 0,
        sku_price: sku.sku_price || 0,
        ProductId: sku.ProductId,

      }));

      // 👉 Log ProductId nào vượt quá INTEGER
      skusData.forEach(s => {
        if (s.ProductId > 2147483647) {
          console.error('🚨 SKU ProductId vượt giới hạn INTEGER:', s.ProductId);
        }
      });

      await queryInterface.bulkInsert('Sku', skusData, { transaction });
      console.log(`✅ Đã insert ${skusData.length} Skus`);

      // --------------------
      // Insert SkuAttr
      // --------------------
      if (data.SkuAttr.length > 0) {
        const skuAttrData = data.SkuAttr.map(attr => ({
          sku_no: attr.sku_no,
          sku_stock: attr.sku_stock || 0,
          sku_price: attr.sku_price || 0,
          sku_attrs: JSON.stringify(attr.sku_attrs || {}),
        }));

        await queryInterface.bulkInsert('SkuAttr', skuAttrData, { transaction });
        console.log(`✅ Đã insert ${skuAttrData.length} SkuAttr`);
      }

      // --------------------
      // Insert SkuSpecs
      // --------------------
      if (data.SkuSpecs.length > 0) {
        const skuSpecsData = data.SkuSpecs.map(spec => ({
          SkuId: spec.SkuId,
          sku_specs: JSON.stringify(spec.sku_specs || {}),
        }));

        await queryInterface.bulkInsert('SkuSpecs', skuSpecsData, { transaction });
        console.log(`✅ Đã insert ${skuSpecsData.length} SkuSpecs`);
      }

      // --------------------
      // Insert SpuToSku
      // --------------------
      if (data.SpuToSku.length > 0) {
        const spuToSkuData = data.SpuToSku.map(record => {
          const match = record.spu_no.match(/\d+$/);
          const productId = match ? parseInt(match[0], 10) : null;
          if (!productId) {
            console.warn(`⚠️ Không extract được ProductId từ spu_no: ${record.spu_no}`);
            return null;
          }
          if (productId > 2147483647) {
            console.error('🚨 SpuToSku ProductId vượt giới hạn INTEGER:', productId, ' từ spu_no:', record.spu_no);
          }
          return {
            spu_no: record.spu_no,
            sku_no: record.sku_no,
            ProductId: productId,
          };
        }).filter(Boolean);

        if (spuToSkuData.length > 0) {
          await queryInterface.bulkInsert('SpuToSku', spuToSkuData, { transaction });
          console.log(`✅ Đã insert ${spuToSkuData.length} SpuToSku`);
        } else {
          console.log('⚠️ Không có SpuToSku hợp lệ để insert, bỏ qua.');
        }
      }

      console.log('🛒 Đang tổng hợp Inventories...');

      // 👉 Không query DB, dùng ngay data.SkuAttr và skusData

      // Map sku_no -> ProductId
      const skuNoToProductId = {};
      skusData.forEach(sku => {
        skuNoToProductId[sku.sku_no] = sku.ProductId;
      });

      // Tổng hợp tồn kho
      const inventoryMap = {}; // { ProductId: tổng tồn kho }

      data.SkuAttr.forEach(attr => {
        const productId = skuNoToProductId[attr.sku_no];
        if (!productId) {
          console.warn(`⚠️ Không tìm thấy ProductId cho sku_no: ${attr.sku_no}`);
          return;
        }
        if (!inventoryMap[productId]) {
          inventoryMap[productId] = 0;
        }
        inventoryMap[productId] += attr.sku_stock || 0;
      });

      console.log(`✅ Đã tổng hợp tồn kho cho ${Object.keys(inventoryMap).length} sản phẩm`);

      const productIdToShopId = {};
      productsData.forEach(p => {
        productIdToShopId[p.id] = p.ShopId;
      });

      // Dùng productIdToShopId đã map từ productsData
      const inventoriesData = Object.keys(inventoryMap).map(productId => {
        const shopId = productIdToShopId[productId];
        if (!shopId) {
          console.warn(`⚠️ Không tìm thấy ShopId cho ProductId ${productId}`);
          return null;
        }
        return {
          ProductId: parseInt(productId, 10),
          ShopId: shopId,
          inven_quantity: inventoryMap[productId],
          inven_location: 'SG',
          createdAt: random_created_at(),
          updatedAt: random_created_at()
        };
      }).filter(Boolean);

      if (inventoriesData.length > 0) {
        await queryInterface.bulkInsert('Inventories', inventoriesData, { transaction });
        console.log(`✅ Đã insert ${inventoriesData.length} Inventories`);
      } else {
        console.log('⚠️ Không có dữ liệu Inventories hợp lệ để insert');
      }


      await transaction.commit();
      console.log('🎉 Seeder chạy thành công!');
    } catch (err) {
      console.error('🔥 Lỗi trong quá trình chạy seeder:', err.message);
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('SpuToSku', null);
    await queryInterface.bulkDelete('SkuSpecs', null);
    await queryInterface.bulkDelete('SkuAttr', null);
    await queryInterface.bulkDelete('Sku', null);
    await queryInterface.bulkDelete('Products', null);
    console.log('🧹 Đã rollback xóa toàn bộ data!');
  }
};
