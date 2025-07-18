const { getClient } = require('../../../db/edb/edb');
const orderRepository = require('../../../db/edb/repositories/orderRepository');

async function pushOrderToES(orderDoc) {
    const es = await getClient();
    await es.index({
        index: 'orders',
        id: `${orderDoc.orderId}`,
        body: orderDoc
    });
}

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
                shippingStatus: shippingStatus
            }
        }
    });
}

async function pushProductToES(productDoc) {
    const es = await getClient();

    const esDoc = {
        ...productDoc,
        CategoryPath: Array.isArray(productDoc.CategoryPath)
            ? productDoc.CategoryPath.map(String)
            : productDoc.CategoryPath,
        attrs: typeof productDoc.attrs === 'object'
            ? JSON.stringify(productDoc.attrs)
            : productDoc.attrs
    };

    await es.index({
        index: 'products',
        id: String(productDoc.id),
        body: esDoc
    });
}

async function deleteProductFromES(productId) {
    const es = await getClient();
    try {
        await es.delete({
            index: 'products',
            id: String(productId)
        });
        console.log(`Product ${productId} deleted from ES`);
    } catch (err) {
        if (err.meta && err.meta.statusCode === 404) {
            console.log(`Product ${productId} not found in ES, skip delete`);
        } else {
            throw err;
        }
    }
}



module.exports = { pushOrderToES, pushOrderDetailToES, updateOrderStatusInES, pushProductToES, deleteProductFromES };
