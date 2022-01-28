const { query } = require('../connection_db');

const Common = require('../../service/common');

common = new Common();

module.exports = async function postOneOrderData(orderOneList) {
    let result = {};
    const hasData = await common.checkOrderData(orderOneList.orderID, orderOneList.memberID, orderOneList.productID);
    const hasComplete = await common.checkOrderComplete(orderOneList.orderID);

    if (hasData === true) {
        result.status = "新增單筆訂單資料失敗。"
        result.err = "已有該筆訂單資料！"
        return Promise.reject(result)
    }

    if (hasComplete === true) {
        result.status = "新增單筆訂單資料失敗。"
        result.err = "該筆訂單已經完成。"
        return Promise.reject(result)
    }

    const price = await common.getProductPrice(orderOneList.productID);

    const orderList = {
        order_id: orderOneList.orderID,
        member_id: orderOneList.memberID,
        product_id: orderOneList.productID,
        order_quantity: orderOneList.quantity,
        order_price: orderOneList.quantity * price,
        is_complete: 0,
        create_date: orderOneList.createDate
    }
    try {
        await query('INSERT INTO order_list SET ?', orderList);
        result.status = "新增單筆訂單資料成功。"
        result.orderList = orderList
        return Promise.resolve(result);
    } catch (err) {
        console.log(err);
        result.status = "新增單筆訂單資料失敗。"
        result.err = "伺服器錯誤，請稍後在試！"
        return Promise.reject(result);
    }
}
