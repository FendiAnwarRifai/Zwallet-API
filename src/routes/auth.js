const express = require('express')
const router = express.Router()
const { loginUser, sendEmail, verification} = require('../controllers/authController')

router
.post('/login',loginUser)
.post('/email',sendEmail)
.get('/verify/:id',verification)
module.exports = router