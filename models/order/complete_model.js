const config = require('../../config/development_config');
const { query } = require('../connection_db');
const transporter = require('../connection_mail');

const Common = require('../../service/common');

common = new Common();

module.exports = async function orderComplete(orderID, memberID) {
    const hasData = await common.checkOrderDataOnly(orderID, memberID);
    const hasComplete = await common.checkOrderComplete(orderID, memberID);
    let result = {};

    if (hasData === false) {
        result.status = "完成訂單失敗";
        result.err = "沒有該筆資料"
        return Promise.reject(result);
    }

    if (hasComplete === true) {
        result.status = "完成訂單失敗";
        result.err = "該筆資料已完成"
        return Promise.reject(result);
    }

    const orderData = common.getOrderData();
    //const productID = orderData[0].product_id;

    for (let i = 0; i < orderData.length; ++i) {
        const hasStock = await common.checkStock(orderData[i].product_id, orderData[i].order_quantity);
        if (hasStock !== true) {
            // 存貨不足
            result.status = "完成訂單失敗";
            result.err = "存貨不足"
            return Promise.reject(result);
        }
    }

    try {
        await query(
            `UPDATE product, order_list SET product.quantity = product.quantity - order_list.order_quantity 
            WHERE order_list.product_id = product.id and order_list.order_id = ?;`,
            orderID);
    } catch (error) {
        result.status = "完成訂單失敗";
        result.err = "伺服器錯誤"
        return Promise.reject(result);
    }

    try {
        await query(
            `UPDATE order_list SET is_complete = 1 WHERE order_id = ?;`
            , orderID);
    } catch (error) {
        result.status = "完成訂單失敗";
        result.err = "伺服器錯誤"
        return Promise.reject(result);
    }

    const memberData = await common.getMemberData(memberID);

    const mailOptions = {
        from: `"弱智兒購物網" < ${config.senderMail.user} >`,
        to: memberData.email,
        subject: memberData.name + '幹你娘感謝你購買訂單已經完成',
        html: `<p>Hi, ${memberData.name} </p>` + `<br>` + `<br>` + `<span>感謝您訂購<b>弱智兒購物網</b>的商品，歡迎下次再來！</span>`
    }
    console.table(mailOptions)

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            result.status = "完成訂單失敗";
            result.err = err
            return Promise.reject(result);
        }
        console.log(`Message ${info.messageId} sent: ${info.response}`)
    })
    result.status = "成功完成訂單流程";
    return Promise.resolve(result);
}
