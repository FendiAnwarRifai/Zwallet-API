module.exports = {
  response: (statusCek, res, result, status, err) => {
    const resultPrint = {
    }
    resultPrint.status = statusCek
    resultPrint.statusCode = status
    resultPrint.result = result
    resultPrint.message = err || null
    res.status(status)
    res.json(resultPrint)
  }
}
