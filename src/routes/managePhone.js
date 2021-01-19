const express = require('express')
const router = express.Router()
const managePhoneController = require('../controllers/managePhoneController')
router
  .get('/', managePhoneController.view)
  .post('/', managePhoneController.insert)
  .delete('/:id', managePhoneController.delete)
module.exports = router
