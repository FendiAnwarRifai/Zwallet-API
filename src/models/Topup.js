const connection = require('../configs/db')

const topup = {
  viewTopup: () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM topup INNER JOIN users ON topup.id_user=users.id', (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  insertTopup: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO topup SET ?', data, (error, results) => {
        if (!error) {
          connection.query('SELECT * FROM topup WHERE id = ?', results.insertId, (error2, results2) => {
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
  getTopupById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM topup WHERE id = ?', id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  updateTopup: (id, data) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE topup SET ?  WHERE id = ?', [data, id], (error, results) => {
        if (!error) {
          connection.query('SELECT * FROM topup WHERE id = ?', id, (error2, results2) => {
            if (results.affectedRows === 0) {
              resolve({
                status: 404,
                message: 'Data Not Found',
                data: results2
              })
            }
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
  deleteTopup: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM topup WHERE id = ?', id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  }
}

module.exports = topup
