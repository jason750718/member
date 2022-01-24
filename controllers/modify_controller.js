const toRegister = require('../models/register_model');
const loginAction = require('../models/login_model');
const updateAction = require('../models/update_model');
const checkCustomer = require('../service/member_check');
const encryption = require('../models/encryption');
const config = require('../config/development_config');
const verify = require('../models/verifycation');

const jwt = require('jsonwebtoken');
const formidable = require('formidable');
const fs = require('fs');

check = new checkCustomer();

module.exports = class Member {
    postRegister(req, res, next) {
        // 進行加密
        const password = encryption(req.body.password);
        const memberData = {
            name: req.body.name,
            email: req.body.email,
            password: password,
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

    // 登入
    postLogin(req, res, next) {
        const password = encryption(req.body.password);
        const memberData = {
            email: req.body.email,
            password: password
        }
        loginAction(memberData).then(rows => {
            // if 登入失敗
            // else 登入成功
            if (check.checkNull(rows) === true) {
                res.json({
                    result: {
                        status: "登入失敗",
                        err: "請輸入正確的帳號或密碼"
                    }
                })
            } else {
                const token = jwt.sign({
                    algorithm: 'HS256',
                    exp: Math.floor(Date.now() / 1000) + (60 * 60), //一小時後過期
                    data: rows[0].id
                }, config.secret);
                res.setHeader('token', token);
                res.json({
                    result: {
                        status: "登入成功",
                        loginMember: "歡迎 " + rows[0].name + " 的登入！"
                    }
                })
            }
        })
    }

    putUpdate(req, res, next) {
        const token = req.headers['token'];
        if (check.checkNull(token) === true) {
            res.json({
                err: "請輸入token！"
            })
        } else {
            verify(token).then(tokenResult => {
                if (tokenResult === false) {
                    res.json({
                        result: {
                            status: "token錯誤",
                            err: "請重新輸入"
                        }
                    })
                } else {
                    const id = tokenResult;
                    const password = encryption(req.body.password);
                    const memberUpdateData = {
                        name: req.body.name,
                        password: password,
                        update_date: onTime()
                    }

                    updateAction(id, memberUpdateData).then(result => {
                        res.json({
                            result: result
                        })
                    }, (err) => {
                        res.json({
                            result: err
                        })
                    })
                }
            })
        }
    }

    putUpdateImg(req, res, next) {
        const form = new formidable.IncomingForm();
        const token = req.headers['token'];
        if (check.checkNull(token) === true) {
            res.json({
                err: "請輸入 token！"
            });
            return;
        }

        verify(token).then(tokenResult => {
            if (tokenResult === false) {
                res.json({
                    result: "token 錯誤",
                    err: "請重新登入"
                });
                return;
            }
            const id = tokenResult;
            form.parse(req, async (err, fields, files) => {
                let isFileSizeOK = check.checkFileSize(files.file.size)
                let ifFileTypeOK = check.checkFileType(files.file.mimetype);
                if (!isFileSizeOK) {
                    res.json({
                        result: {
                            status: "上傳檔案失敗",
                            err: "請上傳小於1MB的檔案"
                        }
                    });
                    return;
                }

                if (!ifFileTypeOK) {
                    res.json({
                        result: {
                            status: "上傳檔案失敗",
                            err: "僅支援 png, jpg, jpeg 等格式"
                        }
                    });
                    return;
                }

                console.log(JSON.stringify(files.file));
                // 將圖片轉成base64編碼
                const image = await fileToBase64(files.file.filepath);
                const password = encryption(fields.password);
                const memberUpdateData = {
                    name: fields.name,
                    password: password,
                    img: image,
                    update_date: onTime()
                };

                updateAction(id, memberUpdateData).then(result => {
                    res.json({
                        result: result
                    })
                }, err => {
                    res.json({
                        result: err
                    })
                })
            })
        });
    }
}

const fileToBase64 = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'base64', (err, data) => {
            resolve(data);
        })
    });
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
