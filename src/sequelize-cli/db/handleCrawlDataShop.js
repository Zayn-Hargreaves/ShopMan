const fs = require('fs');

// Đọc tất cả file shop.txt (giả sử các file được gộp lại hoặc xử lý riêng từng file)
const shopData = [];
const files = ['./clothing/shop.txt', './electronics/shop.txt', './food/shop.txt', './game/shop.txt', './watches/shop.txt']; // Thay bằng tên file thực tế

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    lines.forEach(line => {
        try {
            shopData.push(JSON.parse(line));
        } catch (e) {
            console.error(`Error parsing line in ${file}: ${line}`);
        }
    });
});

// Loại bỏ trùng lặp dựa trên shopid
const uniqueShops = [];
const seenShopIds = new Set();

shopData.forEach(shop => {
    if (!seenShopIds.has(shop.shopid)) {
        seenShopIds.add(shop.shopid);
        uniqueShops.push(shop);
    }
});

console.log(`Total unique shops: ${uniqueShops.length}`);
// Lưu danh sách shop duy nhất vào file mới (tuỳ chọn)
fs.writeFileSync('unique_shops.json', JSON.stringify(uniqueShops, null, 2));