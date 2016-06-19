var express = require('express')
var errors = express.Router()

errors.use(function (req, res, next) {
  next()
})

errors.use(function (req, res) {
  res.status(404)

  if (/^\/api\//.test(req.url)) { // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' })
      return
    }
  } else { // respond with html page
    if (req.accepts('html')) {
      res.render('404/404', {
        title: '404',
        url: req.url
      })
      return
    }
  }

  // default to plain-text. send()
  res.type('txt').send('Not found')
})

module.exports = function () {
  return errors
}
