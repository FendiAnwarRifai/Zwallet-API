const express = require('express')
const router = express.Router()
const topupController = require('../controllers/TopupController')
router
  .get('/', topupController.view)
  .post('/', topupController.insert)
  .get('/:id', topupController.detail)
  .patch('/:id', topupController.update)
  .delete('/:id', topupController.delete)
module.exports = router
