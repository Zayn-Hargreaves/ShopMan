const { getClient } = require("../edb")
const fs = require('fs');
const path = require('path');

const synonymsPath = path.join(__dirname, '../synonyms.txt');

async function createProductIndex() {
    // Kết nối tới Elasticsearch (Bonsai)
    const client = await getClient();

    try {
        // Đọc và làm sạch file synonyms.txt
        const synonyms = fs.readFileSync(synonymsPath, 'utf8')
            .split('\n')
            .filter(line => line.trim() && !line.startsWith('#'))
            .map(line => line.trim())
            .filter(line => {
                // Loại bỏ dòng có định dạng sai hoặc chứa cụm quá phức tạp
                return !line.includes('=>') && line.split(',').every(term => term.trim().split(' ').length <= 2);
            });

        // Kiểm tra xem index đã tồn tại chưa
        const indexExists = await client.indices.exists({ index: 'products' });

        if (indexExists) {
            console.log('Index "products" đã tồn tại, đang cập nhật mapping...');
            await client.indices.putMapping({
                index: 'products',
                body: {
                    properties: {
                        id: { type: 'integer' },
                        name: {
                            type: 'text',
                            fields: {
                                suggest: { type: 'search_as_you_type' }
                            },
                            analyzer: 'index_analyzer',
                            search_analyzer: 'search_analyzer'
                        },
                        desc: {
                            type: 'text',
                            analyzer: 'index_analyzer',
                            search_analyzer: 'search_analyzer'
                        },
                        desc_plain: {
                            type: 'text',
                            analyzer: 'index_analyzer',
                            search_analyzer: 'search_analyzer'
                        },
                        price: { type: 'float' },
                        discount_percentage: { type: 'integer' },
                        thumb: { type: 'keyword' },
                        status: { type: 'keyword' },
                        slug: { type: 'keyword' },
                        CategoryId: { type: 'integer' },
                        ShopId: { type: 'integer' },
                        rating: { type: 'float' },
                        sale_count: { type: 'integer' },
                        has_variations: { type: 'boolean' },
                        attrs: { type: 'object' },
                        createdAt: { type: 'date' },
                        sort: { type: 'integer' }
                    }
                }
            });
            console.log('Mapping đã được cập nhật.');
        } else {
            console.log('Tạo index "products"...');
            await client.indices.create({
                index: 'products',
                body: {
                    settings: {
                        analysis: {
                            analyzer: {
                                index_analyzer: {
                                    type: 'custom',
                                    tokenizer: 'standard',
                                    filter: [
                                        'lowercase',
                                        'stop_filter'
                                    ],
                                    char_filter: ['html_strip']
                                },
                                search_analyzer: {
                                    type: 'custom',
                                    tokenizer: 'standard',
                                    filter: [
                                        'lowercase',
                                        'stop_filter',
                                        'synonym_graph_filter'
                                    ],
                                    char_filter: ['html_strip']
                                }
                            },
                            filter: {
                                stop_filter: {
                                    type: 'stop',
                                    stopwords: '_english_'
                                },
                                synonym_graph_filter: {
                                    type: 'synonym_graph',
                                    synonyms: synonyms,
                                    updateable: true
                                }
                            }
                        }
                    },
                    mappings: {
                        properties: {
                            id: { type: 'integer' },
                            name: {
                                type: 'text',
                                fields: {
                                    suggest: { type: 'search_as_you_type' }
                                },
                                analyzer: 'index_analyzer',
                                search_analyzer: 'search_analyzer'
                            },
                            desc: {
                                type: 'text',
                                analyzer: 'index_analyzer',
                                search_analyzer: 'search_analyzer'
                            },
                            desc_plain: {
                                type: 'text',
                                analyzer: 'index_analyzer',
                                search_analyzer: 'search_analyzer'
                            },
                            price: { type: 'float' },
                            discount_percentage: { type: 'integer' },
                            thumb: { type: 'keyword' },
                            status: { type: 'keyword' },
                            slug: { type: 'keyword' },
                            CategoryId: { type: 'integer' },
                            ShopId: { type: 'integer' },
                            rating: { type: 'float' },
                            sale_count: { type: 'integer' },
                            has_variations: { type: 'boolean' },
                            attrs: { type: 'object' },
                            createdAt: { type: 'date' },
                            sort: { type: 'integer' }
                        }
                    }
                }
            });
            console.log('Index "products" đã được tạo.');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        if (error.meta && error.meta.body) {
            console.error('Chi tiết lỗi:', JSON.stringify(error.meta.body, null, 2));
        }
    } finally {
        await client.close();
    }
}

// Chạy hàm ngay khi script được gọi
createProductIndex();