const express = require('express')
const router = express.Router()
const UsersController = require('../controllers/UsersController')
const {uploadMulter} = require('../middlewares/upload')
const {verifyAccess} = require('../middlewares/auth')
const {cacheAllUser, getDetailUser} = require('../middlewares/redis')
router
  .get('/',verifyAccess, UsersController.view)
  .post('/', UsersController.insert)
  .get('/:id',verifyAccess, UsersController.detail)
  .patch('/:id', verifyAccess,uploadMulter.single('image'), UsersController.update)
  .delete('/:id',verifyAccess, UsersController.delete)
module.exports = router
