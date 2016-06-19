/**
  run API as separate express server on port 5200
*/
// var runAsServer = (process.argv[2] === 'server') ? true : false
var express = require('express')
var compress = require('compression')
var bodyParser = require('body-parser')
var cors = require('cors')

require('./app')

var app = express()
var apiRouter = require('../../routes/api.router')()
app.set('port', 5200)

app.use(compress())
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/api', apiRouter)

app.listen(5200)
console.log('Listening for api requests on %d', 5200)
