const { query } = require('../connection_db');

const Common = require('../../service/common');

common = new Common();

module.exports = async function orderDelete(deleteList) {
    let result = {};
    for (let key in deleteList) {
        let hasData = await common.checkOrderData(deleteList[key].orderID, deleteList[key].memberID, deleteList[key].productID);
        let hasComplete = await common.checkOrderComplete(deleteList[key].orderID, deleteList[key].memberID);

        if (hasData === false) {
            result.status = "刪除訂單資料失敗。"
            result.err = "找不到該筆資料。"
            return Promise.reject(result);
        }

        if (hasComplete === true) {
            result.status = "刪除訂單資料失敗。"
            result.err = "該筆訂單已完成。"
            return Promise.reject(result);
        }

        try {
            await query('DELETE FROM order_list WHERE order_id = ? AND member_id = ? AND product_id = ?', [deleteList[key].orderID, deleteList[key].memberID, deleteList[key].productID]);
            result.status = "刪除訂單資料成功。";
            result.deleteList = deleteList;
            return Promise.resolve(result);
        } catch (err) {
            console.log("刪除訂單失敗: " + err);
            result.err = "刪除訂單失敗"
            return Promise.reject(result);
        }
    }
}
