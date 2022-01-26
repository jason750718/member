const { query } = require('../connection_db');

module.exports = function memberLogin(memberData) {
    try {
        return query(
            'SELECT * FROM member_info WHERE email = ? AND password = ?',
            [memberData.email, memberData.password]
        );
    } catch (err) { // 處理 reject reason，讓程式繼續
        console.log("登入失敗 err: " + err);
        return Promise.reject(err);
    }
}
