const { throws } = require('assert')
const modelTransaction = require('../models/Transaction')
const helper = require('../helpers/helpers')

const Transaction = {
  view: (req, res) => {
    const sort = req.query.sort
    const id = req.query.id
    modelTransaction.viewAll(sort,id)
      .then(result => {
        const resultTransaction = result
        res.json(resultTransaction)
      })
      .catch((err) => {
        res.json(err)
      })
  },
  insert: (req, res) => {
    const { senderId, receiverId, amount, notes } = req.body

    const data = {
      senderId,
      receiverId,
      amount,
      notes,
      date: new Date(),
      createdAt: new Date()
    }
    modelTransaction.insertTransaction(data)
      .then(result => {
        const resultTransaction = result
        res.json(resultTransaction)
      })
      .catch((err) => {
        helper.response('error', res, null, 200, err.sqlMessage)
      })
  },
  detail: (req, res, next) => {
    const id = req.params.id
    modelTransaction.getTransactionById(id)
      .then(result => {
        const resultTransaction = result
        if (resultTransaction.length === 0) {
          const error = new Error('Data Param or Patch Not Failed')
          error.status = 404
          error.statusCek = 'error'
          return next(error)
        }
        res.json(resultTransaction)
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
    modelTransaction.updateTransaction(id, data)
      .then(result => {
        const resultTransaction = result
        res.json(resultTransaction)
      })
      .catch((err) => {
        helper.response('error', res, null, 200, err.sqlMessage)
      })
  },

  delete: (req, res, next) => {
    const id = req.params.id
    modelTransaction.deleteTransaction(id)
      .then(result => {
        const resultTransaction = result
        console.log(resultTransaction)
        if (resultTransaction.affectedRows === 0) {
          const error = new Error('Data Param or Patch Not Failed')
          error.status = 404
          error.statusCek = 'error'
          return next(error)
        }
        res.json(resultTransaction)
      })
      .catch((err) => {
        res.status(400).json({
          message: 'data error'
        })
      })
  }
}

module.exports = Transaction
