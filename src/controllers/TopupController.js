const { throws } = require('assert')
const modelTopup = require('../models/Topup')
const helper = require('../helpers/helpers')
const Topup = {
  view: (req, res) => {
    modelTopup.viewTopup()
      .then(result => {
        const resultTopup = result
        res.json(resultTopup)
      })
      .catch((err) => {
        res.json(err)
      })
  },
  insert: (req, res) => {
    const { id_user, amount } = req.body

    const data = {
      id_user,
      amount,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    modelTopup.insertTopup(data)
      .then(result => {
        const resultTopup = result
        res.json(resultTopup)
      })
      .catch((err) => {
        helper.response('error', res, null, 200, err.sqlMessage)
      })
  },
  detail: (req, res, next) => {
    const id = req.params.id
    modelTopup.getTopupById(id)
      .then(result => {
        const resultTopup = result
        if (resultTopup.length === 0) {
          const error = new Error('Data Param or Patch Not Failed')
          error.status = 404
          error.statusCek = 'error'
          return next(error)
        }
        res.json(resultTopup)
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
    data.updatedAt = new Date()
    modelTopup.updateTopup(id, data)
      .then(result => {
        const resultTopup = result
        res.json(resultTopup)
      })
      .catch((err) => {
        helper.response('error', res, null, 200, err.sqlMessage)
      })
  },
  delete: (req, res, next) => {
    const id = req.params.id
    modelTopup.deleteTopup(id)
      .then(result => {
        const resultTopup = result
        if (resultTopup.affectedRows === 0) {
          const error = new Error('Data Param or Patch Not Failed')
          error.status = 404
          error.statusCek = 'error'
          return next(error)
        }
        res.json(resultTopup)
      })
      .catch((err) => {
        res.status(400).json({
          message: 'data error'
        })
      })
  }
}

module.exports = Topup
