// DataBase
const config = require('../config/development_config');
const mysql = require('mysql')
const pool = mysql.createPool({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
})

let query = function (sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err)
      } else {
        // 執行 sql 腳本對資料庫進行讀寫
        connection.query(sql, values, (err, rows) => {

          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()  // 結束會話
        })
      }
    })
  })
}

module.exports = { query }
