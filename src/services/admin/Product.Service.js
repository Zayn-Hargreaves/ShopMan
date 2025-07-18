const { NotFoundError } = require("../../cores/error.response");
const RepositoryFactory = require("../../models/repositories/repositoryFactory");
const BaseProductService = require("../common/ProductService");
const { Op } = require("sequelize");
const { pushProductToES, deleteProductFromES } = require("../client/elasticsearch/orderDetailES.service");

class ProductService extends BaseProductService {
    /**
     * Lấy danh sách sản phẩm (có filter, phân trang)
     */
    static async listProducts(shopId, query) {
        await RepositoryFactory.initialize();
        const ProductRepo = RepositoryFactory.getRepository("ProductRepository");

        const {
            status,
            name,
            categoryId,
            page = 1,
            limit = 20,
            minPrice,
            maxPrice,
            sort, // "price", "createdAt"...
        } = query;
        return await ProductRepo.getlistProductByAdmin(shopId, status, name, categoryId, page, limit, minPrice, maxPrice, sort)
    }

    /**
     * Thêm sản phẩm mới
     */
    static generateSkuNo(ProductId, category_code, attrs) {
        // attrs là object: {size: 'M', color: 'White'}
        let base = `SKU-${category_code}-${ProductId}`;
        Object.values(attrs).forEach(val => {
            base += `-${val.toString().toUpperCase().replace(/\s/g, '')}`;
        });
        // Kiểm tra trong DB nếu đã có thì +1 vào cuối
        // Ví dụ: SKU-101-M-WHITE, SKU-101-M-WHITE-2 (nếu bị trùng)
        return base;
    }
    static generateSPUNumber(ProductId, category_code) {
        // product.Category là object, product.id là id sản phẩm
        return `SPU-${category_code}-${ProductId}`;
    }
    static async addProduct(shopId, data) {
        await RepositoryFactory.initialize();
        const sequelize = await RepositoryFactory.getSequelize()
        const ProductRepo = RepositoryFactory.getRepository("ProductRepository");
        const CategoryRepo = RepositoryFactory.getRepository("CategoryRepository");
        const {
            name, price, desc, attrs, CategoryId,
            discount_percentage, sort, has_variations, skus, thumb
        } = data;

        if (!shopId) throw new Error('ShopId is required');
        if (!name || !price || !CategoryId) throw new Error('Missing required fields');

        const transaction = await sequelize.transaction();
        try {
            const category = await CategoryRepo.findOneCategoryById(CategoryId, { transaction });
            if (!category) throw new Error("Category not found");

            // Build category path
            const CategoryPath = await ProductRepo.buildCategoryPath(CategoryId);

            // Tạo sản phẩm
            const product = await ProductRepo.createProduct({
                name, price, desc, attrs, CategoryId,
                discount_percentage, CategoryPath, sort, ShopId: shopId,
                has_variations, status: 'active', thumb
            }, { transaction });

            // Xử lý sku nếu có
            let skuResult = [];
            if (Array.isArray(skus) && skus.length > 0) {
                for (let sku of skus) {
                    // Sinh mã sku, spu
                    const sku_no = this.generateSkuNo(product.id, category.category_code, sku.sku_attrs);
                    const spu_no = this.generateSPUNumber(product.id, category.category_code);
                    sku.sku_no = sku_no;
                    sku.spu_no = spu_no;
                    // Check trùng sku_no
                    const existSku = await ProductRepo.Sku.findOne({ where: { sku_no }, transaction });
                    if (existSku) throw new Error(`SKU ${sku_no} already exists!`);
                    // Tạo các record liên quan
                    console.log("controller::::", sku)
                    const newSku = await ProductRepo.createNewSku(product.id, shopId, sku, { transaction });
                    skuResult.push(newSku);
                }
            }

            await pushProductToES(product)
            await transaction.commit();
            return { product, skus: skuResult };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }


    /**
     * Cập nhật sản phẩm
     */
    static async updateProduct(shopId, productId, data) {
        await RepositoryFactory.initialize();
        const sequelize = await RepositoryFactory.getSequelize();
        const ProductRepo = RepositoryFactory.getRepository("ProductRepository");
        const transaction = await sequelize.transaction();
        try {
            // 1. Kiểm tra quyền
            const product = await ProductRepo.findProductById(productId, { transaction });
            if (!product) throw new Error('Product not found');
            if (product.ShopId !== +shopId) throw new Error('No permission to update this product');

            // 2. Update product info
            Object.assign(product, data);
            await product.save({ transaction });

            // 3. Update CategoryPath nếu đổi category
            let category = await ProductRepo.findCategoryById(data.CategoryId || product.CategoryId, { transaction });
            if (!category) throw new Error("Category not found");

            if (data.CategoryId && data.CategoryId !== product.CategoryId) {
                product.CategoryPath = await ProductRepo.buildCategoryPath(data.CategoryId);
                await product.save({ transaction });
            }

            // 4. Update SKUs (nếu có)
            if (Array.isArray(data.skus)) {
                const newSkuNos = data.skus.map(sku => sku.sku_no);
                const oldSkus = await ProductRepo.findAllSkus(productId, { transaction });

                // Xóa sku nào không còn trong danh sách mới (hard delete hoặc soft tùy bạn)
                for (let oldSku of oldSkus) {
                    if (!newSkuNos.includes(oldSku.sku_no)) {
                        await oldSku.destroy({ transaction });
                    }
                }

                // Thêm hoặc cập nhật sku mới
                for (let newSku of data.skus) {
                    // Tìm sku hiện tại theo sku_no và ProductId
                    let sku = await ProductRepo.findOneSku(newSku.sku_no, productId, { transaction });

                    // Tạo biến kiểm tra thay đổi attr
                    let attrsChanged = false;
                    let oldAttrs = sku && sku.SkuAttr ? sku.SkuAttr.sku_attrs : null;
                    if (sku && JSON.stringify(oldAttrs) !== JSON.stringify(newSku.sku_attrs)) {
                        attrsChanged = true;
                    }

                    // Nếu đã tồn tại SKU (update)
                    if (sku) {
                        let newSkuNo = newSku.sku_no;
                        let newSpuNo = newSku.spu_no;
                        // Nếu attrs thay đổi -> generate lại sku_no, spu_no
                        if (attrsChanged) {
                            newSkuNo = ProductRepo.generateSkuNo(product.id, newSku.sku_attrs); // truyền attr mới!
                            newSpuNo = ProductRepo.generateSPUNumber(product.id, category.category_code);
                        }
                        // Update SKU
                        await ProductRepo.updateSku(
                            productId,
                            shopId,
                            {
                                ...newSku,
                                sku_no: newSkuNo,
                                spu_no: newSpuNo,
                            },
                            attrsChanged ? newSpuNo : undefined,
                            attrsChanged ? newSkuNo : undefined,
                            { transaction }
                        );
                    }
                    // Nếu không có thì tạo mới
                    else {
                        if (!newSku.sku_no) newSku.sku_no = ProductRepo.generateSkuNo(product.id, newSku.sku_attrs);
                        if (!newSku.spu_no) newSku.spu_no = ProductRepo.generateSPUNumber(product.id, category.category_code);
                        await ProductRepo.createNewSku(productId, shopId, newSku, { transaction });
                    }
                }
            }

            await transaction.commit()
            await pushProductToES(product);
            const updatedProduct = await ProductRepo.findProductDetailForAdmin(shopId, productId);
            return updatedProduct;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }



    /**
     * Xoá sản phẩm (soft delete)
     */
    static async deleteProduct(shopId, productId) {
        await RepositoryFactory.initialize();
        const ProductRepo = RepositoryFactory.getRepository("ProductRepository");
        const product = await ProductRepo.findProductById(productId);
        if (!product) throw new Error('Product not found');
        if (product.ShopId !== +shopId) throw new Error('No permission to delete this product');
        await product.destroy();
        await deleteProductFromES(productId)
        return { success: true };
    }

    static async getProductDetailForShop(shopId, productId) {
        await RepositoryFactory.initialize();
        const ProductRepo = RepositoryFactory.getRepository("ProductRepository");
        return await ProductRepo.findProductDetailForAdmin(shopId, productId);
    }
}

module.exports = ProductService;
