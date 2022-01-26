const { query } = require('../connection_db');

const Common = require('../../service/common');

common = new Common();

module.exports = async function orderEdit(updateList) {
    const hasData = await common.checkOrderData(updateList.orderID, updateList.memberID, updateList.productID);
    const hasComplete = await common.checkOrderComplete(updateList.orderID, updateList.memberID, updateList.productID);
    let result = {};

    if (hasData === false) {
        result.status = "更新訂單資料失敗";
        result.err = "沒有該筆資料"
        return Promise.reject(result); 
    }

    if (hasComplete === false) {
        result.status = "更新訂單資料失敗";
        result.err = "該筆資料已完成"
        return Promise.reject(result);
    }

    if (hasData && hasComplete) {
        const price = await common.getProductPrice(updateList.productID);
        const orderPrice = updateList.quantity * price;
        try {
            await query('UPDATE order_list SET order_quantity = ?, order_price = ?, update_date = ? WHERE order_id = ? AND member_id = ? AND product_id = ?', [updateList.quantity, orderPrice, updateList.updateDate, updateList.orderID, updateList.memberID, updateList.productID]);
        } catch (err) {
            console.log(err);
            result.status = "更新訂單資料失敗。"
            result.err = "伺服器錯誤，請稍後在試！"
            return Promise.reject(result);
        }
        result.status = "更新訂單成功"
        result.updateList = updateList;
        return Promise.resolve(result);
    }

    result.status = "更新訂單資料失敗";
    result.err = "未知錯誤"
    return Promise.reject(result);
}
