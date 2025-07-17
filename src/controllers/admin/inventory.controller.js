const InventoryService = require("../../services/admin/Inventory.Service.js")
const { OkResponse } = require("../../cores/success.response")

class InventoryController {
    listInventories = async (req, res, next) => {
        new OkResponse({
            message: "List inventories success",
            metadata: await InventoryService.listInventories(req.params.AdminShopId, req.query)
        }).send(res);
    }
    updateInventory = async (req, res, next) => {
        new OkResponse({
            message: "Update inventory success",
            metadata: await InventoryService.updateInventory(req.params.AdminShopId, req.params.inventoryId, req.body)
        }).send(res);
    }
}

module.exports = new InventoryController();
