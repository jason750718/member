const { query } = require('../models/connection_db');

module.exports = class Common {
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

    async checkOrderComplete(orderID, memberID, productID) {
        try {
            let rows = await query('SELECT * FROM order_list WHERE order_id = ? AND member_id = ? AND product_id = ? AND is_complete = 0', [orderID, memberID, productID]);
            if (rows[0] === undefined) {
                return Promise.resolve(false);
            } else {
                return Promise.resolve(true);
            }
        } catch (error) {
            console.log('取得未完成訂單產品失敗');
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
