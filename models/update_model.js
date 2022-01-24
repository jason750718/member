const { query } = require('./connection_db');

module.exports = async function customerEdit(id, memberUpdateData) {
    let result = {}
    try {
        let rows = await query('UPDATE member_info SET ? WHERE id = ?', [memberUpdateData, id]);
        // 若寫入資料庫成功，則回傳給clinet端下：
        result.status = "會員資料成功。"
        result.memberUpdateData = memberUpdateData;
        console.log(result.status);
        return Promise.resolve(result);
    } catch (err) {
        console.log("會員資料更新錯誤 err: " + err);
        return Promise.reject(result);
    }
}
