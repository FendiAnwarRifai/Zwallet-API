require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = process.env.DB_PORT
const bodyParser = require('body-parser')
const helper = require('./src/helpers/helpers')
var cors = require('cors')
app.use(cors())


// routes
const routerUsers = require('./src/routes/users')
const routerTransaction = require('./src/routes/transaction')
const routerTopup = require('./src/routes/topup')
const routerPhone = require('./src/routes/managePhone')
const routerAuth = require('./src/routes/auth')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('dev'))

app.use('/users', routerUsers)
app.use('/transaction', routerTransaction)
app.use('/topup', routerTopup)
app.use('/managePhone', routerPhone)
app.use('/auth', routerAuth)

app.use('/uploads',express.static('./uploads'))
app.use((err, req, res, next) => {
  helper.response(err.statusCek, res, null, err.status, err.message)
})

app.use('*', (req, res) => {
  helper.response('error', res, null, 404, 'url not found')
})

app.listen(PORT, () => console.log(`server is running port ${PORT}
http://localhost:${PORT}`))
