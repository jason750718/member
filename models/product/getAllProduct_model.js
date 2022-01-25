const { query } = require('../connection_db');

module.exports = async function getAllProducts(memberData) {
    let result = {};
    try {
        let rows = await query('SELECT * FROM product');
        return Promise.resolve(rows);
    } catch (error) {
        console.log('取得產品列表失敗: ' + error);
        result.status = "取得全部訂單資料失敗";
        result.err = "伺服器錯誤，請稍後再試"
        return Promise.reject(result);
    }
}
