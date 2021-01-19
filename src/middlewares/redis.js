const redis = require("redis")
const { response } = require("../helpers/helpers")
const client = redis.createClient(6379)
exports.cacheAllUser = (req, res, next) => {
    const idUser = req.users.userId
    client.get("getAllUser", function (err, data) {
        const result = JSON.parse(data)
        if (data !== result) {
            // return response('success', res, result, 200, null)
        } else {
            next()
        }
    })
}
exports.getDetailUser = (req, res, next) => {
    const id = req.params.id
    client.get("userById"+id, function (err, data) {
        const result = JSON.parse(data)
        if (data !== result) {
            return response('success', res, result, 200, null)
        } else {
            next()
        }
    })
}