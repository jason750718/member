const { query } = require('../connection_db');

module.exports = function getOneOrderData(memberID) {
    try {
        return query('SELECT *FROM order_list WHERE member_id = ?', memberID);
    } catch (error) {
        console.log('取得單一會員訂單失敗');
        return error;
    }
}
