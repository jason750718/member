const { query } = require('../connection_db');

module.exports = function getAllProducts(memberData) {
    try {
        return query('SELECT * FROM product');
    } catch (error) {
        console.log('取得產品列表失敗: ' + error);
        return error;
    }
}
