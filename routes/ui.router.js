/**
* @Author: craigbojko
* @Date:   2016-03-20T20:49:52+00:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-19T19:22:24+01:00
*/

var express = require('express')
var ui = express.Router()

ui.use(function (req, res, next) {
  next()
})

ui.get('/', function (req, res) {
  require('../src/ui/app/controllers/home').index(req, res)
})

module.exports = function () {
  return ui
}
