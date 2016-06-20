/**
* @Author: craigbojko
* @Date:   2016-03-20T20:49:52+00:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-19T20:32:02+01:00
*/

/* globals process */

require('colors')
var path = require('path')
var env = process.env.NODE_ENV || 'development'
var rootPath = path.normalize(__dirname + '/..')

console.log('SERVER RUNNING: QUBIT HARVEST-ASANA MAPPER::'.green)
console.log('NODE ENV '.magenta, process.env.NODE_ENV)
console.log('ENV '.magenta, env)
console.log('ROOTPATH '.magenta, rootPath)

var config = {
  development: {
    root: rootPath,
    credentials: 'root:password',
    app: {
      name: 'qbHAMapper'
    },
    port: 5100,
    db: 'mongodb://localhost/qbHAMapper_dev'
  },

  test: {
    root: rootPath,
    credentials: 'root:password',
    app: {
      name: 'qbHAMapper'
    },
    port: 5100,
    db: 'mongodb://localhost/qbHAMapper_test'
  },

  production: {
    root: rootPath,
    credentials: 'root:password',
    app: {
      name: 'qbHAMapper'
    },
    port: 5100,
    db: 'mongodb://localhost/qbHAMapper'
  }
}

module.exports = config[env]
