const { OkResponse } = require("../cores/success.response")
const ElasticSearchService = require("../services/ElasticSearch.service")

class AnalyticsController{
    getRevenue =async({req,res,next})=>{
        const {interval} = req.body //mont, year, combined
        new OkResponse({
            message:'get revenue analysis completed',
            metadata: await ElasticSearchService.getRevenueAnalystic({interval})
        }).send(res)
    }
    getTopProduct = async(req, res, next)=>{
        const {metric} = req.body
        new OkResponse({
            message : 'get top product successfull',
            metadata:await ElasticSearchService.getTopProduct({metric})
        }).send(res)
    }
}

module.exports = new AnalyticsController()