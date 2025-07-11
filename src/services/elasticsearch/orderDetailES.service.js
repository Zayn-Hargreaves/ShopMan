const { getClient } = require('../../db/edb/edb');
const orderRepository = require('../../db/edb/repositories/orderRepository');

// Push bản ghi Order (có nested products)
async function pushOrderToES(orderDoc) {
    const es = await getClient();
    await es.index({
        index: 'orders',
        id: `${orderDoc.orderId}`,
        body: orderDoc
    });
}

// (Giữ nguyên hàm pushOrderDetailToES nếu muốn lưu order detail riêng)
async function pushOrderDetailToES(orderDetailDoc) {
    const es = await getClient();
    await es.index({
        index: 'order_details',
        id: `${orderDetailDoc.orderId}_${orderDetailDoc.productId}_${orderDetailDoc.shopId}`,
        body: orderDetailDoc
    });
}
async function updateOrderStatusInES(orderId, status, shippingStatus) {
    const es = await getClient();
    await es.update({
        index: 'orders',
        id: String(orderId),
        body: {
            doc: {
                status: status,
                shippingStatus:shippingStatus
            }
        }
    });
}

module.exports = { pushOrderToES, pushOrderDetailToES, updateOrderStatusInES };
