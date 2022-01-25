const { query } = require('../connection_db');

module.exports = function orderProductListData(orderList) {
    //訂購整筆商品
    let result = {};

    return new Promise(async (resolve, reject) => {
        // 提取orderID
        let orderID = await getOrderID() + 1;

        const products = orderList.productID;
        const productArray = products.split(',');
        // console.log("productArray: " + productArray);
        const quantitys = orderList.quantity;
        const quantityArray = quantitys.split(',');
        // console.log("quantityArray: " + quantityArray);

        //productID與quantity合併成新object
        //array1 [3, 2, 1]
        //array2 [1, 2, 3]
        //merge為object:{
        //  3: 1,
        //  2: 2,
        //  1, 3
        //}

        let productQuantity = {};
        for (let i in productArray) {
            // console.log('productArray i: ' + productArray[i]);
            let index = productArray.indexOf(productArray[i]);
            // console.log('the index: ' + index);
            for (let j in quantityArray) {
                // console.log('quantityArray j: ' + quantityArray[j]);
                productQuantity[productArray[i]] = quantityArray[index];
                // console.log('new quantityArray j: ' + quantityArray[index]);
            }
        }

        let orderAllData = [];
        for (let key in productQuantity) {
            const price = await (getProductPrice(key));
            const orderData = {
                order_id: orderID,
                member_id: orderList.memberID,
                product_id: key,
                order_quantity: parseInt(productQuantity[key]),
                order_price: parseInt(price) * parseInt(productQuantity[key]),
                create_date: orderList.orderDate,
                is_complete: 0
            };

            try {
                query('INSERT INTO order_list SET ?', orderData);
            } catch (err) {
                console.log(err);
                result.err = "伺服器錯誤，請稍後在試！"
                reject(result);
                return;
            }
            orderAllData.push(orderData);

            // insert order data.
            // db.query('INSERT INTO order_list SET ?', orderData, function (err, rows) {
            //     if (err) {
            //         console.log(err);
            //         result.err = "伺服器錯誤，請稍後在試！"
            //         reject(result);
            //         return;
            //     }
            // })
            // orderAllData.push(orderData);
        }

        result.state = "訂單建立成功。";
        result.orderData = orderAllData
        resolve(result);
    })
}

const getOrderID = async () => {
    try {
        let rows = await query('SELECT MAX(order_id) AS id FROM order_list');
        return Promise.resolve(rows[0].id);
    } catch (error) {
        console.log("取得訂單編號失敗: " + error);
        return Promise.reject(error);
    }
}

// 取得商品價格
const getProductPrice = async (productID) => {
    try {
        let rows = await query('SELECT price FROM product WHERE id = ?', [productID]);
        return Promise.resolve(rows[0].price);
    } catch (error) {
        console.log("取得商品價格失敗: " + error);
        return Promise.reject(error);
    }
}
