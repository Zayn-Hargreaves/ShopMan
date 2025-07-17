const { OkResponse } = require("../../cores/success.response")
const { trackingUserEvent } = require("../services/ElasticSearch.service")

class TrackingController{
    trackingEvent = async(req, res, next)=>{
        const {event_type, user_id, product_id, timestamp} = req.body
        new OkResponse({
            message:'index tracking event completed',
            metadata: await trackingUserEvent({event_type, user_id, product_id, timestamp})
        }).send(res)
    }
}

module.exports = new TrackingController()