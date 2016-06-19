/**
 * @Author: craigbojko
 * @Date:   2016-03-20T20:49:52+00:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-19T20:12:54+01:00
 */

require('app-module-path').addPath(__dirname + '/')

var express = require('express')
var compress = require('compression')
var bodyParser = require('body-parser')
var cors = require('cors')
// var mongoose = require('mongoose')

var config = require('./config/config')

var app = express()
var apiRouter = require('./routes/api.router')()
var uiRouter = require('./routes/ui.router')()
var errorHandlers = require('./routes/errors.router')()

app.use(express.static(config.root + '/ui/public'))

app.set('port', config.port)
app.set('views', config.root + '/src/ui/app/views')
app.set('models', config.root + '/src/api/models')

app.engine('html', require('hogan-express'))
app.set('view engine', 'html')
app.set('layout', 'layouts/default')
app.set('partials', {
  header: 'includes/header',
  footer: 'includes/footer'
})

app.use(compress())
app.use(cors())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

app.use('/', uiRouter)
app.use('/api', apiRouter) // TODO - check for Qubit IP range for HUBL endpoints
app.use('/', errorHandlers)

app.listen(config.port)
