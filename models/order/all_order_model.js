const { query } = require('../connection_db');

module.exports = function getAllOrderData() {
    try {
        return query('SELECT * FROM order_list');
    } catch (error) {
        console.log("取得所有訂單資料失敗");
        return error;
    }
}
