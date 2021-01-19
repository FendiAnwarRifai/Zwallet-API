const { throws } = require('assert')
const managePhone = require('../models/managePhone')
const helper = require('../helpers/helpers')
const managePhones = {
  view: (req, res) => {
    const id = req.query.id
    managePhone.viewPhone(id)
    .then(result => {
      const results = result
      res.json(results)
    })
    .catch((err) => {
      res.json(err)
    })
  },
  insert: (req, res) => {
   let data = req.body
   data = JSON.parse(JSON.stringify(data))
   data.createdAt= new Date()
   managePhone.insertPhone(data)
   .then(result => {
    const resultsPhone = result
    res.json(resultsPhone)
  })
   .catch((err) => {
    helper.response('error', res, null, 200, err.sqlMessage)
  })
 },
 delete: (req, res, next) => {
  const id = req.params.id
  managePhone.deletePhone(id)
  .then(result => {
    const results = result
    console.log(results)
    if (results.affectedRows === 0) {
      const error = new Error('Data Param or Patch Not Failed')
      error.status = 404
      error.statusCek = 'error'
      return next(error)
    }
    res.json(results)
  })
  .catch((err) => {
    res.status(400).json({
      message: 'data error'
    })
  })
}
}
module.exports = managePhones