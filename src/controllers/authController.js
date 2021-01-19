const { throws } = require('assert')
const bcrypt = require('bcryptjs')
const { cekUser } = require('../models/auth')
const helper = require('../helpers/helpers')
var jwt = require('jsonwebtoken')
const { sendEmail } = require('../helpers/email')
const connection = require('../configs/db')
exports.loginUser = (req, res) => {
        const { email, password } = req.body
        cekUser(email)
        .then((result) => {
                if (result.length === 0) {
                      return helper.response('error', res, null, 401,'email is not specified')
              }
              const user = result[0]
              if (user.verification === "nothing") {
                return helper.response('error', res, null, 401, 'account has not been verified, please check your email!')
        }
        bcrypt.compare(password, user.password, function (err, resCek) {
                if (!resCek) {
                        return helper.response('error', res, null, 401, 'password wrong')
                } else {
                        delete user.password
                        delete user.pin
                        jwt.sign({ userId: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: 3600 }, function (err, token) {
                                user.token = token
                                user.expiredToken = 3600000
                                return helper.response('success', res, user, 200, 'login success')
                        })
                }
        })
})
        .catch((err) => {
                console.log(err)
                helper.response('error', res, null, 401, 'email is not specified')
        })
}

exports.sendEmail = (req, res) => {
        const email = req.body.email
        const username = req.body.username
        const link = req.body.link
        sendEmail(email, username, link)
        .then((result) => {
                helper.response('success', res, { id: result.messageId }, 200, 'Email Sent Successfully')
        })
        .catch((err) => {
                helper.response('error', res, null, 500, err)
        })
}
exports.verification = (req, res) => {
        const id = req.params.id
        return new Promise((resolve, reject) => {
                connection.query('SELECT * FROM users WHERE email = ?', id, (error, results) => {
                        if (results.length === 0) {
                          return helper.response('error', res, null, 401,'email does not exist')
                  }
                  else if (results[0].verification === "verified") {
                        return helper.response('warning', res, null, 200, 'akun ini sudah diverifikasi')
                } else {
                        connection.query('UPDATE users SET verification="verified"  WHERE email = ?', id, (error2, results2) => {
                                if (!error) {
                                        return helper.response('success', res, null, 200, 'akun berhasil diverifikasi')

                                } else {
                                        reject(error)
                                }
                        })

                }
        })
        })
}
