const axios = require('axios');
const GHN_ID = process.env.GHN_ID;
const GHN_TOKEN = process.env.GHN_TOKEN;

class GhnService {
    static async createGhnOrder(orderData) {
        const url = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create';
        const headers = { 'Token': GHN_TOKEN, 'ShopId': GHN_ID, 'Content-Type': 'application/json' };
        const response = await axios.post(url, orderData, { headers });
        return response.data;
    }

    static async getOrderInfo(orderCode) {
        const url = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail';
        const headers = { 'Token': GHN_TOKEN, 'ShopId': GHN_ID, 'Content-Type': 'application/json' };
        const body = { order_code: orderCode };
        const response = await axios.post(url, body, { headers });
        return response.data;
    }

    static async cancelOrder(orderCode) {
        const url = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/switch-status/cancel';
        const headers = { 'Token': GHN_TOKEN, 'ShopId': GHN_ID, 'Content-Type': 'application/json' };
        const body = { order_codes: [orderCode] };
        const response = await axios.post(url, body, { headers });
        return response.data;
    }

    static async calculateFee(feeData) {
        const url = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee';
        const headers = { 'Token': GHN_TOKEN, 'ShopId': GHN_ID, 'Content-Type': 'application/json' };
        const response = await axios.post(url, feeData, { headers });
        return response.data;
    }

    static async trackOrder(orderCode) {
        const url = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/track';
        const headers = { 'Token': GHN_TOKEN, 'ShopId': GHN_ID, 'Content-Type': 'application/json' };
        const body = { order_code: orderCode };
        const response = await axios.post(url, body, { headers });
        return response.data;
    }

    static async printLabel(orderCodes = []) {
        const url = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/a5/gen-token';
        const headers = { 'Token': GHN_TOKEN, 'ShopId': GHN_ID, 'Content-Type': 'application/json' };
        const body = { order_codes: orderCodes };
        const response = await axios.post(url, body, { headers });
        return response.data;
    }
}

module.exports = GhnService;
