const { NotFoundError } = require("../../cores/error.response");
const initializeModels = require("../../db/dbs/associations");
const { getSelectData } = require("../../utils");
class ProductRepository {
    constructor(models) {
        this.Products = models.Products
        this.Category = models.Category,
        this.SpuToSku = models.SpuToSku,
        this.Sku = models.Sku,
        this.SkuAttr = models.SkuAttr,
        this.SkuSpec = models.SkuSpec,
        this.Wishlist = models.Wishlist
        this.Discounts = models.Discounts,
        this.Category = models.Category,
        this.DiscountsProducts = models.DiscountsProducts
        this.Campaign = models.Campaign
    }
    async findProductBySlug(slug) {
        const product = await this.Products.findOne({
            where: { slug },
            include: [
                {
                    model: this.SpuToSku,
                    as: 'SpuToSku',
                    required: false,
                    include: [
                        {
                            model: this.Sku,
                            as: 'Sku',
                            required: false,
                            include: [
                                {
                                    model: this.SkuAttr,
                                    as: 'SkuAttr',
                                    required: false,
                                },
                                {
                                    model: this.SkuSpec,
                                    as: 'SkuSpec',
                                    required: false,
                                }
                            ]
                        },

                    ]
                }
            ],
            raw: true,
        })
        return product
    }
    
    async getDealOfTheDayProducts(limit = 10){
        return await this.Products.findAll({
            include:[
                {
                    model:this.Discounts,
                    through:{attributes:[]},
                    where:{
                        status:"active",
                        StartDate:{[Op.lte]: new Date()},
                        EndDate:{[Op.gte]: new Date()},
                        MaxUses:{[Op.gt]:this.Discounts.UserCounts}
                    }
                }
            ],
            where:{
                status:'active',
            },
            limit,
            order:[["sale_count","DESC"]]
        })
    }
    
    async getAllDealProducts(page = 1, size = 20){
        const offset = (page -1) * size
        const {count, rows} = await this.Products.findAndCountAll({
            include:[
                {
                    model:this.Discounts,
                    through:{ attributes:[]},
                    where:{
                        status:'active',
                        StartDate:{[Op.lte]:new Date()},
                        EndDate:{[Op.gte]:new Date()},
                        MaxUses:{[Op.gt]: this.Discounts.UserCounts}
                    }
                }
            ],
            where:{
                status:"active"
            },
            offset,
            limit:size,
            order:[['sale_count',"DESC"]],
        })
        return {
            totalItems:count,
            totalPages:Math.ceil(count/size),
            currentPage:page,
            product:rows
        }
    }
    async getProductMetrics(productIds){
        return await this.Products.findAll({
            where:{
                id:productIds,
                status:'active'
            },
            attributes:getSelectData(['id','sale_count'])
        })
    }
    async findProductByIds(productIds){
        return await this.Products.findAll({
            where:{
                id:productIds,
                status:'active'
            },
            attributes:getSelectData(['id','slug','name', 'sale_count']),
            include:[
                {
                    model:this.SpuToSku,
                    as:'SpuToSku',
                    require:false,
                    include:[
                        {
                            model:this.Sku,
                            as:"Sku",
                            require:false,
                            include:[
                                {model:this.SkuAttr, as :"SkuAttr", require:false},
                                {model:this.SkuSpec, as:"SkuSpec", require:false}
                            ]
                        }
                    ]
                }
            ]
        })
    }
    async findNewArrivalsProduct(page, size){
        const offset = (page - 1) * size
        const {count, rows} = await this.Products.findAndCountAll({
            where:{
                status:"active",
            },
            attributes:getSelectData(['id','slug','name','price','discount_percentage', 'thumb','rating','sale_count']),
            include:[
                {
                    model:this.SpuToSku,
                    require:false,
                    include:{
                        model:this.Sku,
                        require:false,
                        include:[
                            {model:this.SkuAttr, require:false},
                            {model:this.SkuSpec, require:false}
                        ]
                    }
                }
            ],
            order:[['createAt','DESC']],
            offset,
            limit:size
        })
        return {
            totalItems:count,
            product:rows
        }
    }
}


module.exports = async () => {
    const models = await initializeModels()
    return new ProductRepository(models)
}