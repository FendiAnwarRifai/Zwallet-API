var jwt = require('jsonwebtoken')
const helper = require('../helpers/helpers')
exports.verifyAccess = (req,res, next) => {
    let authorization = req.headers.authorization
    if (!authorization) {
        return helper.response('error', res, null, 401, 'There is no token, please login')
    } else {
        let token = authorization.split(" ")
        token = token[1]
        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
            if (err) {
                if (err.name === 'JsonWebTokenError') {
                    return helper.response('error', res, null, 401, 'Invalid Token')
                } else if (err.name === 'TokenExpiredError'){
                   return helper.response('error', res, null, 401, 'Token Expired')
                }
            }
            req.users = decoded
            next()
          })
    }
}