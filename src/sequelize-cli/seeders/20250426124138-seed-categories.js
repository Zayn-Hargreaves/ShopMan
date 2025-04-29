'use strict';

const fs = require('fs');
const path = require("path")
const parentCategories = JSON.parse(fs.readFileSync(path.join(__dirname, 'organized_categories.json'), 'utf-8'));
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert danh mục cha
    const parentData = parentCategories.map(parent => ({
      name: parent.name,
      desc: parent.desc,
      status: parent.status,
      thumb: parent.thumb,
      slug: parent.name.toLowerCase().replace(/ /g, '-'), // Tạo slug tạm thời, hook sẽ xử lý lại
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('Categories', parentData, {});

    // Lấy ID của danh mục cha
    const parentRecords = await queryInterface.sequelize.query(
      `SELECT id, name FROM "Categories" WHERE "ParentId" IS NULL`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Tạo map từ tên danh mục cha đến ID
    const parentIdMap = parentRecords.reduce((map, record) => {
      map[record.name] = record.id;
      return map;
    }, {});

    // Insert danh mục con
    const childData = [];
    parentCategories.forEach(parent => {
      const parentId = parentIdMap[parent.name];
      parent.children.forEach(child => {
        childData.push({
          name: child.name,
          desc: `Subcategory of ${parent.name}`,
          status: child.status,
          thumb: null, // Có thể dùng parent.thumb nếu muốn
          slug: child.name.toLowerCase().replace(/ /g, '-'), // Tạo slug tạm thời
          ParentId: parentId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
    });

    await queryInterface.bulkInsert('Categories', childData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};