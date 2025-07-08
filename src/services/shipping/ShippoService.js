const shippo_key = process.env.SHIPPO_KEY
const shippo = require("shippo")(process.env.SHIPPO_KEY);

// 1. Tạo shipment (tạo đơn hàng)
async function createShipment({ fromAddress, toAddress, parcel, isReturn = false }) {
    try {
        const shipment = await shippo.shipment.create({
            address_from: fromAddress,
            address_to: toAddress,
            parcels: [parcel],
            async: false,
            is_return: isReturn
        });
        return shipment;
    } catch (err) {
        throw new Error(err.message);
    }
}

// 2. Lấy shipping label (purchase, trả về link PDF dán lên kiện)
async function purchaseLabel(shipmentId, rateObjectId) {
    try {
        const transaction = await shippo.transaction.create({
            shipment: shipmentId,
            rate: rateObjectId,
            label_file_type: "PDF",
            async: false
        });
        return transaction;
    } catch (err) {
        throw new Error(err.message);
    }
}

// 3. Huỷ đơn (refund shipping label)
// Chỉ áp dụng với một số loại vận chuyển US, không phải label đã gửi!
async function refundLabel(transactionId) {
    try {
        const refund = await shippo.refund.create({
            transaction: transactionId
        });
        return refund;
    } catch (err) {
        throw new Error(err.message);
    }
}

// 4. Tracking đơn hàng (theo carrier + tracking number)
async function trackShipment(carrier, trackingNumber) {
    try {
        const track = await shippo.track.get_status(carrier, trackingNumber);
        // Trả về trạng thái + history + vị trí nếu có
        return track;
    } catch (err) {
        throw new Error(err.message);
    }
}

// 5. Lấy shipment info (lấy lại shipment đã tạo)
async function getShipment(shipmentId) {
    try {
        const shipment = await shippo.shipment.retrieve(shipmentId);
        return shipment;
    } catch (err) {
        throw new Error(err.message);
    }
}

// 6. Lấy label PDF của transaction
async function getLabel(transactionId) {
    try {
        const tx = await shippo.transaction.retrieve(transactionId);
        return tx.label_url; // link download
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports = {
    createShipment,
    purchaseLabel,
    refundLabel,
    trackShipment,
    getShipment,
    getLabel
};
