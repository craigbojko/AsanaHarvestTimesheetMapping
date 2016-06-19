var path = require('path')
var env = process.env.NODE_ENV || 'development'
var rootPath = path.normalize(__dirname + '/..')

console.log('SERVER RUNNING: QUBIT HARVEST-ASANA MAPPER::')
console.log('NODE ENV ', process.env.NODE_ENV)
console.log('ENV ', env)
console.log('ROOTPATH ', rootPath)

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
