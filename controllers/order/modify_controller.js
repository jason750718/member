const Check = require('../../service/member_check');

const verify = require('../../models/member/verifycation_model');
const orderProductListData = require('../../models/order/order_all_product_model');
const orderEdit = require('../../models/order/update_model');
const deleteOrderData = require('../../models/order/delete_model');
const orderOneProduct = require('../../models/order/order_one_product_model');

const Common = require('../../service/common');

common = new Common();
check = new Check();

module.exports = class ModifyOrder {
    postOrderOneProduct(req, res, next) {
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
                            status: "token 錯誤",
                            err: "請重新輸入"
                        }
                    });
                } else {
                    const memberID = tokenResult;
                    const orderOneList = {
                        orderID: req.body.orderID,
                        memberID: memberID,
                        productID: req.body.productID,
                        quantity: req.body.quantity
                    }

                    orderOneProduct(orderOneList).then(result => {
                        res.json({
                            result: result
                        })
                    }, err => {
                        res.json({
                            result: err
                        });
                    });
                }
            })
        }
    }

    deleteOrderProduct(req, res, next) {
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
                            status: "token 錯誤",
                            err: "請重新輸入"
                        }
                    });
                } else {
                    const orderID = req.body.orderID;
                    const memberID = tokenResult;
                    const productID = req.body.productID.replace(" ", "");
                    const splitProductID = productID.split(",");

                    let deleteList = [];

                    for (let i = 0; i < splitProductID.length; ++i) {
                        deleteList.push({orderID: orderID, memberID: memberID, productID:splitProductID[i]});
                    }

                    deleteOrderData(deleteList).then(result => {
                        console.log(result);
                        res.json({
                            result: result
                        })
                    }, err => {
                        console.log(err);
                        res.json({
                            result: err
                        });
                    });
                }
            })
        }
    }

    putOrderEdit(req, res, next) {
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
                            status: "token 錯誤",
                            err: "請重新輸入"
                        }
                    });
                } else {
                    const memberID = tokenResult;
                    const orderList = {
                        memberID: memberID,
                        productID: req.body.productID,
                        quantity: req.body.quantity,
                        orderID: req.body.orderID,
                        orderDate: common.onTime()
                    }
                    console.log("memberID : " + memberID);

                    orderEdit(orderList).then(result => {
                        console.log(result);
                        res.json({
                            result: result
                        })
                    }, err => {
                        console.log(err);
                        res.json({
                            result: err
                        });
                    });
                }
            })
        }
    }
    postOrderAllProduct(req, res, next) {
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
                            status: "token 錯誤",
                            err: "請重新輸入"
                        }
                    });
                } else {
                    const memberID = tokenResult;
                    const orderList = {
                        memberID: memberID,
                        productID: req.body.productID,
                        quantity: req.body.quantity,
                        orderDate: common.onTime()
                    }

                    orderProductListData(orderList).then(result => {
                        res.json({
                            result: result
                        })
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
