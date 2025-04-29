const fs = require('fs');

// Đọc tất cả file category.txt
const categoryData = [];
const files = ['./clothing/category.txt', './electronics/category.txt', './food/category.txt', './game/category.txt', './watches/category.txt']; // Thay bằng tên file thực tế

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    lines.forEach(line => {
        try {
            categoryData.push(JSON.parse(line));
        } catch (e) {
            console.error(`Error parsing line in ${file}: ${line}`);
        }
    });
});

// Tổ chức danh mục cha và con
const parentCategories = [
    {
        name: 'Cloth',
        desc: 'Parent category for clothing',
        status: 'active',
        thumb: 'https://down-vn.img.susercontent.com/file/687f3967b7c2fe6a134a2c11894eea4b.webp',
        children: [
            { catid: 100017, name: 'Clothing Men', status: 'active' },
            { catid: 100011, name: 'Clothing in Summer', status: 'active' }
        ]
    },
    {
        name: 'Electronics',
        desc: 'Parent category for electronics',
        status: 'active',
        thumb: 'https://down-vn.img.susercontent.com/file/978b9e4cb61c611aaaf58664fae133c5.webp',
        children: [
            { catid: 100535, name: 'Electronics kind of Summer', status: 'active' },
            { catid: 100010, name: 'Electronics kind Premium', status: 'active' },
            { catid: 100636, name: 'Electronics for people who love Summer', status: 'active' }
        ]
    },
    {
        name: 'Food',
        desc: 'Parent category for food',
        status: 'active',
        thumb: 'https://down-sg.img.susercontent.com/file/87f207a436d17540e4f6764eaae1d2db_tn',
        children: [
            { catid: 100629, name: 'Food of around the world', status: 'active' }
        ]
    },
    {
        name: 'Game',
        desc: 'Parent category for games',
        status: 'active',
        thumb: 'https://down-sg.img.susercontent.com/file/5e198de52d3678551335e3b18feb9503_tn',
        children: [
            { catid: 100634, name: 'Video Games by PlayStation', status: 'active' },
            { catid: 102752, name: 'Video Games by Xbox', status: 'active' }
        ]
    },
    {
        name: 'Watch',
        desc: 'Parent category for watches',
        status: 'active',
        thumb: 'https://down-sg.img.susercontent.com/file/a7a7242a87b1febc2f70df97fecde728_tn',
        children: [
            { catid: 100534, name: 'Watches manufactured in Switzerland', status: 'active' },
            { catid: 100013, name: 'Watches produced in China', status: 'active' }
        ]
    }
];

// Lưu dữ liệu đã tổ chức
fs.writeFileSync('organized_categories.json', JSON.stringify(parentCategories, null, 2));