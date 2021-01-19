const connection = require('../configs/db')

const Transaction = {
  viewAll: (sort,id) => {
    return new Promise((resolve, reject) => {
      if (sort && id) {
        connection.query(`SELECT trans.id as id_trasaksi,trans.senderId,trans.receiverId,trans.amount, u.name as nama_pengirim, us.name as nama_penerima,trans.date,trans.notes,u.image as image_sender,us.image as image_receiver,trans.createdAt FROM transaction trans INNER JOIN users u ON (u.id = trans.senderId) INNER JOIN users us ON (us.id =trans.receiverId) WHERE senderId='${id}' OR receiverId='${id}' ORDER BY trans.date ${sort}`, (error, results) => {
          if (!error) {
            resolve(results)
          } else {
            reject(error)
          }
        })
      } else {
        connection.query(`SELECT trans.id as id_trasaksi,trans.senderId,trans.receiverId,trans.amount, u.name as nama_pengirim, us.name as nama_penerima,trans.date,trans.notes,u.image as image_sender,us.image as image_receiver,trans.createdAt FROM transaction trans INNER JOIN users u ON (u.id = trans.senderId) INNER JOIN users us ON (us.id =trans.receiverId) WHERE senderId='${id}' OR receiverId='${id}' ORDER BY trans.date DESC `, (error, results) => {
          if (!error) {
            resolve(results)
          } else {
            reject(error)
          }
        })
      }
    })
  },
  insertTransaction: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT  * FROM users WHERE id = ?', data.senderId, (error, results) => {
        if (results[0].saldo <= data.amount) {
          resolve({
            status: 401,
            title : 'Error!',
            statusText : 'error',
            message: 'Your balance is not enough'
          })
        }else{
         connection.query('INSERT INTO transaction SET ?', data, (err, results) => {
          if (!err) {
            connection.query('SELECT * FROM transaction WHERE id = ?', results.insertId, (error2, results2) => {
              resolve({
                status: 200,
                title : 'Success!',
                status : 'success',
                message: 'Transaction success',
                data: results2
              })
            })
          } else {
            reject(err)
          }
        })
       }
     })

    })
  },
  getTransactionById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT trans.id as id_trasaksi,trans.amount, u.name as nama_pengirim, us.name as nama_penerima,trans.date,trans.notes,trans.createdAt FROM transaction trans INNER JOIN users u ON (u.id = trans.senderId) INNER JOIN users us ON (us.id =trans.receiverId) WHERE trans.id = ?', id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },

  updateTransaction: (id, data) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE transaction SET ?  WHERE id = ?', [data, id], (error, results) => {
        if (!error) {
          connection.query('SELECT trans.id as id_trasaksi,trans.amount, u.name as nama_pengirim, us.name as nama_penerima,trans.date,trans.notes,trans.createdAt FROM transaction trans INNER JOIN users u ON (u.id = trans.senderId) INNER JOIN users us ON (us.id =trans.receiverId) WHERE trans.id = ?', id, (error2, results2) => {
            resolve({
              status: 200,
              message: 'Data Berhasil Diupdate',
              data: results2
            })
          })
        } else {
          reject(error)
        }
      })
    })
  },

  deleteTransaction: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM transaction WHERE id = ?', id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  }
}
module.exports = Transaction
