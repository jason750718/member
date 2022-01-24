const jwt = require('jsonwebtoken');
const config = require('../config/development_config');

module.exports = function verifyToken(token) {
    let tokenResult = "";
    const time = Math.floor(Date.now() / 1000);
    return new Promise((resolve, reject) => {
        if (token) {
            jwt.verify(token, config.secret, function (err, decode) {
                if (err) {
                    tokenResult = false;
                    resolve(tokenResult);
                } else if (decode.exp <= time) {
                    tokenResult = false;
                    resolve(tokenResult);
                } else {
                    tokenResult = decode.data;
                    resolve(tokenResult);
                }
            })
        }
    });
}
