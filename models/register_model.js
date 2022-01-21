const { query } = require('./connection_db');

module.exports = async function register(memberData) {
    let result = {};
    try {
        let rows = await query('SELECT email FROM member_info WHERE email = ?', memberData.email);
        if (rows.length >= 1) {
            result.status = "註冊失敗。";
            result.err = "已有重複的Email。";
            console.log(result.status);
            return Promise.reject(result);
        }
        let insertRows = await query('INSERT INTO member_info SET ?', memberData);
        // 若寫入資料庫成功，則回傳給clinet端下：
        result.status = "註冊成功。"
        result.registerMember = memberData;
        console.log(result.status);
        return Promise.resolve(result);

    } catch (err) { // 處理 reject reason，讓程式繼續
        console.log("操操操 err: " + err);
        return Promise.reject(result);
    }

    // 尋找是否有重複的email
    // return new Promise((resolve, reject) => {
    //     query('SELECT email FROM member_info WHERE email = ?', memberData.email)
    //     .then((rows) => {
    //         console.log("rows: " + JSON.stringify(rows));
    //         console.log("rows.length: " + rows.length);
    //         if (rows.length >= 1) {
    //             console.log("rows.length >= 1");
    //             result.status = "註冊失敗。";
    //             result.err = "已有重複的Email。";
    //             return Promise.reject(result);
    //         }
    //         console.log("return memberData.email;");
    //         return memberData.email;
    //     })
    //     .then(
    //         (memberData) => {
    //             console.log("memberData: " + memberData);
    //             // 若寫入資料庫成功，則回傳給clinet端下：
    //             result.status = "註冊成功。"
    //             result.registerMember = memberData;
    //             resolve(result);
    //         }, (err, data) => {
    //             console.log("幹幹幹");
    //             console.log("err: " + JSON.stringify(err));
    //             console.log("data: " + data);
    //             reject(result);
    //             return;
    //         }
    //     )
    //     .catch((err) => {
    //         console.log("操操操");
    //         console.log(err);
    //         reject(result);
    //         return;
    //     })
    // });




    // db.query('SELECT email FROM member_info WHERE email = ?', memberData.email, (err, rows) => {
    //     // 若資料庫部分出現問題，則回傳給client端「伺服器錯誤，請稍後再試！」的結果。
    //     if (err) {
    //     }
    //     // 如果有重複的email
    //     if (rows.length >= 1) {
    //         result.status = "註冊失敗。";
    //         result.err = "已有重複的Email。";
    //         reject(result);
    //     } else {
    //         // 將資料寫入資料庫
    //         db.query('INSERT INTO member_info SET ?', memberData, (err, rows) => {
    //             // 若資料庫部分出現問題，則回傳給client端「伺服器錯誤，請稍後再試！」的結果。
    //             if (err) {
    //                 console.log(err);
    //                 result.status = "註冊失敗。";
    //                 result.err = "伺服器錯誤，請稍後在試！"
    //                 reject(result);
    //                 return;
    //             }
    //             // 若寫入資料庫成功，則回傳給clinet端下：
    //             result.status = "註冊成功。"
    //             result.registerMember = memberData;
    //             resolve(result);
    //         })
    //     }
    // })
}
