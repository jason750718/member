const { query } = require('../connection_db');

module.exports = async function getAllOrderData() {
    try {
        let rows = await query('SELECT * FROM order_list');
        return Promise.resolve(rows);
    } catch (error) {
        console.log("取得所有訂單資料失敗");
        return Promise.reject(error);
    }
}
