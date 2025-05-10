const { OkResponse } = require("../cores/success.response")
const ElasticSearchService = require("../services/ElasticSearch.service")
const ShopService = require("../services/Shop.Service")
class ShopController {
    getShopDetails = async (req, res, next) => {
        const slug = req.params.slug
        console.log(slug)
        new OkResponse({
            message: "get shop details sucess",
            metadata: await ShopService.getShopDetails(slug)
        }).send(res)
    }
    getProductShop = async (req, res, next) => {
        const { slug } = req.params;
        console.log(slug)
        const { minPrice, maxPrice, sortBy, lastSortValues, pageSize, isAndroid } = req.query;
        new OkResponse({
            message: "Get products by shop successfully",
            metadata: await ElasticSearchService.searchProducts({
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                shopSlug: slug,
                sortBy: sortBy ? JSON.parse(sortBy) : undefined,
                lastSortValues: lastSortValues ? JSON.parse(lastSortValues) : undefined,
                pageSize: pageSize ? Number(pageSize) : undefined,
                isAndroid: isAndroid === 'true'
            })
        }).send(res);
    }
}

module.exports = new ShopController()