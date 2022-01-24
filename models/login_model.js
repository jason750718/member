const { query } = require('./connection_db');

module.exports = async function memberLogin(memberData) {
    let result = {};
    // return new Promise((resolve, reject) => {
    //     db.query()
    // });
    try {
        let rows = await query(
            'SELECT * FROM member_info WHERE email = ? AND password = ?',
            [memberData.email, memberData.password]
        );
        console.log(rows);
        return Promise.resolve(rows);

    } catch (err) { // 處理 reject reason，讓程式繼續
        console.log("登入失敗 err: " + err);
        return Promise.reject(result);
    }
}
