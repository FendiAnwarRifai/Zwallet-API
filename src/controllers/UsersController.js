const { throws } = require('assert')
const { v4: uuidv4 } = require('uuid')
const modelUsers = require('../models/Users')
const bcrypt = require('bcryptjs')
const helper = require('../helpers/helpers')
const { cekUser } = require('../models/auth')
var multer = require('multer')
const redis = require("redis")
const { sendEmail } = require('../helpers/email')
const client = redis.createClient(6379)
const Users = {
  view: (req, res) => {
  	const idUser = req.users.userId
    const search = req.query.search || ' '
    const limit = req.query.limit || 4
    const offset = (req.query.page - 1) * limit
    modelUsers.viewUsers(idUser, search, limit, offset)
      .then(result => {
        const resultUser = result
        // client.setex("getAllUser", 20, JSON.stringify(resultUser))
        res.json(resultUser)
      })
      .catch((err) => {
        res.json(err)
      })
  },
  insert: (req, res) => {
    let data = req.body
    data = JSON.parse(JSON.stringify(data))
    data.id = uuidv4()
    cekUser(data.email)
      .then((result) => {
        if (result.length > 0) {
          return helper.response('error', res, null, 401,'email is already in use')
        }
        data.image = 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png'
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(data.password, salt, function (err, hash) {
            data.password = hash
            data.role = 'user'
            data.verification = 'nothing'
            data.createdAt = new Date()
            data.updatedAt = new Date()
            modelUsers.insertUsers(data)
              .then(result => {
                const resultUsers = result.data[0]
                delete resultUsers.password
                delete resultUsers.pin
                client.flushdb(function (err, succeeded) {
                  console.log(succeeded)
                })
                // send email
                const email = resultUsers.email
                const username = resultUsers.username
                const link = req.body.link
                sendEmail(email, username, link)
                  .then((result) => {
                    console.log('Send Email Success')
                  })
                  .catch((err) => {
                   return helper.response('error', res, null, 500, err)
                  })
                // end send email
                resultUsers.message2 = 'check your email for account verification'
                res.json(resultUsers)
              })
              .catch((err) => {
                helper.response('error', res, null, 401, err.sqlMessage)
              })
          })
        })
      })
      .catch((err) => {
        helper.response('error', res, null, 401, err.sqlMessage)
      })
    // end validasi

  },
  detail: (req, res, next) => {
    const id = req.params.id
    modelUsers.getUserById(id)
      .then(result => {
        const resultUser = result
        if (resultUser.length === 0) {
          return helper.response('error', res, null, 401, 'Id Not Found')
        }
        delete resultUser[0].password
        delete resultUser[0].pin
        // client.setex("userById" + id, 20, JSON.stringify(resultUser))
        res.json(resultUser)
      })
      .catch((err) => {
        res.status(400).json({
          message: 'data error'
        })
      })
  },

  update: (req, res) => {
    let data = req.body
    const { id } = req.params
    data = JSON.parse(JSON.stringify(data))
    if (!req.file) {
      data.updatedAt = new Date()
    }
    else if (req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpg" && req.file.mimetype !== "image/jpeg") {
      return helper.response('error', res, null, 401, 'Only .png, .jpg and .jpeg format allowed!')
    }
    else if (req.file.size >= 8388608) {
      return helper.response('error', res, null, 401, 'Image size is too large, it must be under 8MB')
    } else {
      data.image = `${process.env.BASE_URL}/uploads/${req.file.filename}`
      data.updatedAt = new Date()
      modelUsers.deleteImage(id)
        .then(result => {
          console.log(result)
        })
    }
    modelUsers.updateUser(id, data)
      .then(result => {
        const resultUser = result
        if(resultUser.data.length === 0)
        {
          return helper.response('error', res, null, 401, 'Id Not Found')
        }
        client.flushdb(function (err, succeeded) {
          console.log(succeeded)
        })
        res.json(resultUser)
      })
      .catch((err) => {
        helper.response('error', res, null, 200, err.sqlMessage)
      })

  },

  delete: (req, res, next) => {
    const id = req.params.id
    const userData = req.users
    if (id == userData.userId) {
      return helper.response('error', res, null, 200, 'cannot delete your id')
    } else if (userData.role === 'user') {
      return helper.response('error', res, null, 401, 'you are not admin, data cannot be deleted')
    }
    modelUsers.deleteUser(id)
      .then(result => {
        const resultUser = result
        if (resultUser.affectedRows === 0) {
          const error = new Error('Data Param or Patch Not Failed')
          error.status = 404
          error.statusCek = 'error'
          return next(error)
        }
        helper.response('success', res, null, 200, `id ${id} deleted successfully`)
      })
      .catch((err) => {
        res.status(400).json({
          message: 'data error'
        })
      })
  }
}

module.exports = Users
