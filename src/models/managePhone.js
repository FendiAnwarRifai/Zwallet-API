const connection = require('../configs/db')

const managePhone = {
	  viewPhone: (id) => {
    return new Promise((resolve, reject) => {
      if (id) {
        connection.query(`SELECT * FROM phone_user WHERE id_user='${id}'`, (error, results) => {
          if (!error) {
            resolve(results)
          } else {
            reject(error)
          }
        })
      }
      else {
        
      }
    })
  },
  insertPhone: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO phone_user SET ?', data, (error, results) => {
        if (!error) {
          connection.query('SELECT * FROM phone_user WHERE id = ?', results.insertId, (error2, results2) => {
            resolve({
              status: 200,
              message: 'Data Berhasil Diinputkan',
              data: results2
            })
          })
        } else {
          reject(error)
        }
      })
    })
  },
    deletePhone: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM phone_user WHERE id = ?', id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  }
}
module.exports = managePhone