const { query } = require('../models/connection_db');

module.exports = class Common {
    async getMemberData(memberID) {
        try {
            let rows = await query('SELECT * FROM member_info WHERE id = ?', [memberID]);
            return rows[0];
        } catch (error) {
            console.log("取得會員資料失敗: " + error);
            return error;
        }
    }

    async getOrderData(orderID, memberID) {
        try {
            return await query('SELECT * FROM order_list WHERE order_id = ? AND member_id = ? ', [orderID, memberID]);
        } catch (error) {
            console.log("取得訂單資料失敗: " + error);
            return error;
        }
    }

    async getOrderID() {
        try {
            let rows = await query('SELECT MAX(order_id) AS id FROM order_list');
            return rows[0].id;
        } catch (error) {
            console.log("取得訂單編號失敗: " + error);
            return error;
        }
    }

    // 取得商品價格
    async getProductPrice(productID) {
        try {
            let rows = await query('SELECT price FROM product WHERE id = ?', [productID]);
            return rows[0].price
        } catch (error) {
            console.log("取得商品價格失敗: " + error);
            return error;
        }
    }

    async checkOrderData(orderID, memberID, productID) {
        try {
            let rows = await query('SELECT * FROM order_list WHERE order_id = ? AND member_id = ? AND product_id = ?', [orderID, memberID, productID]);
            if (rows[0] === undefined) {
                return Promise.resolve(false);
            } else {
                return Promise.resolve(true);
            }
        } catch (error) {
            console.log('取得訂單產品失敗');
            return Promise.reject(error);
        }
    }

    async checkOrderDataOnly(orderID, memberID) {
        try {
            let rows = await query('SELECT * FROM order_list WHERE order_id = ? AND member_id = ?', [orderID, memberID]);
            if (rows[0] === undefined) {
                return Promise.resolve(false);
            } else {
                return Promise.resolve(true);
            }
        } catch (error) {
            console.log('取得訂單產品失敗');
            return Promise.reject(error);
        }
    }

    async checkOrderComplete(orderID, memberID) {
        try {
            let rows = await query('SELECT * FROM order_list WHERE order_id = ? AND member_id = ?', [orderID, memberID]);
            if (rows.length === 0) {
                return Promise.resolve(false);
            }

            if (rows[0].is_complete === 1) {
                return Promise.resolve(true);
            } else {
                return Promise.resolve(false);
            }
        } catch (error) {
            console.log('檢查完成訂單產品失敗');
            return Promise.reject(error);
        }
    }

    async checkOrderStock(orderProductID, orderQuantity) {
        try {
            let rows = await query('SELECT * FROM product WHERE id = ?', [orderProductID]);
            if (rows[0].quantity < orderQuantity) {
                return Promise.resolve(rows[0].name + "庫存不足");
            }
            return Promise.resolve(true);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //取得現在時間，並將格式轉成YYYY-MM-DD HH:MM:SS
    onTime() {
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
}
