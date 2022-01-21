const toRegister = require('../models/register_model');
const checkCustomer = require('../service/member_check');

check = new checkCustomer();

module.exports = class Member {
    postRegister(req, res, next) {
        const memberData = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            create_date: onTime()
        }

        if (!check.checkEmail(memberData.email)) {
            res.json({
                status: "註冊失敗",
                result: "請輸入正確的 Email 格式。"
            })
            return;
        }
        // 寫入資料庫
        toRegister(memberData).then((ret) => {
            res.json({
                status: "註冊成功",
                result: ret
            });
        }, (err) => {
            res.json({
                status: "註冊失敗",
                result: err
            })
        })
    }
}

//取得現在時間，並將格式轉成YYYY-MM-DD HH:MM:SS
const onTime = () => {
    const date = new Date();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const hh = date.getHours();
    const mi = date.getMinutes();
    const ss = date.getSeconds();

    return [date.getFullYear(), "-" +
        (mm > 9 ? '' : '0') + mm, "-" +
        (dd > 9 ? '' : '0') + dd, " " +
        (hh > 9 ? '' : '0') + hh, ":" +
        (mi > 9 ? '' : '0') + mi, ":" +
        (ss > 9 ? '' : '0') + ss
    ].join('');
}
