const { OkResponse } = require("../cores/success.response")
const ElasticSearchService = require("../services/ElasticSearch.service")

class OrderController{
    getRevenue = async(req, res, next)=>{
        const {interval} = req.body //month, 'year', combined,
        new OkResponse({
            message:"get revenue analysis completed",
            metadata: await ElasticSearchService.getRevenueAnalystic({interval})
        }).send(res)
    }
}

module.exports = new OrderController()