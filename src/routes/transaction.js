const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')
const {verifyAccess} = require('../middlewares/auth')
router
  .get('/',verifyAccess, transactionController.view)
  .post('/',verifyAccess, transactionController.insert)
  .get('/:id',verifyAccess, transactionController.detail)
  .patch('/:id',verifyAccess, transactionController.update)
  .delete('/:id',verifyAccess, transactionController.delete)
module.exports = router
