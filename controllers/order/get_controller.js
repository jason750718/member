const Check = require('../../service/member_check');

const verify = require('../../models/member/verifycation_model');
const orderData = require('../../models/order/all_order_model');
const orderOneData = require('../../models/order/one_order_model');

check = new Check();

module.exports = class GetOrder {
    getOneOrder(req, res, next) {
        const token = req.headers['token'];
        if (check.checkNull(token) === true) {
            res.json({
                err: "請輸入token！"
            });
        } else {
            verify(token).then(tokenResult => {
                if (tokenResult === false) {
                    res.json({
                        result: {
                            status: "token錯誤",
                            err: "請重新登入"
                        }
                    });
                } else {
                    const memberID = tokenResult;

                    orderOneData(memberID).then(result => {
                        res.json({
                            result: result
                        })
                    }, err => {
                        res.json({
                            result: err
                        });
                    })
                }
            });
        }
    }

    getAllOrder(req, res, next) {
        const token = req.headers['token'];
        if (check.checkNull(token) === true) {
            res.json({
                err: "請輸入 token！"
            });
        } else if (check.checkNull(token) === false) {
            verify(token).then(tokenResult => {
                if (tokenResult === false) {
                    res.json({
                        result: {
                            status: "token錯誤",
                            err: "請重新登入"
                        }
                    });
                } else {
                    orderData().then(result => {
                        res.json({
                            result: result
                        });
                    }, err => {
                        res.json({
                            result: err
                        });
                    });
                }
            })
        }
    }
}
