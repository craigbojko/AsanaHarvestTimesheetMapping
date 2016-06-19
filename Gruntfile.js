var request = require('request')

module.exports = function (grunt) {
  require('time-grunt')(grunt)
  require('load-grunt-tasks')(grunt)

  var reloadPort = 35729
  var files

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concurrent: {
      dev: ['nodemon'],
      options: {
        logConcurrentOutput: true
      }
    },
    nodemon: {
      dev: {
        script: 'app.js',
        options: {
          nodeArgs: ['--debug'],
          env: {
            PORT: '5100',
            NODE_ENV: 'development'
          },
          // omit this property if you aren't serving HTML files and
          // don't want to open a browser tab on start
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour)
            })

            // opens browser on initial server start
            nodemon.on('config:update', function () {
              // Delay before server listens on port
              setTimeout(function () {
                require('open')('http://localhost:5100')
              }, 1000)
            })

            // refreshes browser when server reboots
            nodemon.on('restart', function () {
              // Delay before server listens on port
              setTimeout(function () {
                require('fs').writeFileSync('.rebooted', 'rebooted')
              }, 1000)
            })
          }
        }
      }
    },
    watch: {
      server: {
        files: ['.rebooted'],
        tasks: ['delayed-livereload'],
        options: {
          livereload: true
        }
      }
    }
  })

  // grunt.config.requires('watch.js.files')
  // files = grunt.config('watch.js.files')
  // files = grunt.file.expand(files)

  grunt.loadNpmTasks('grunt-nodemon')
  grunt.loadNpmTasks('grunt-concurrent')

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async()
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','), function (err, res) {
        var reloaded = !err && res.statusCode === 200
        if (reloaded) {
          grunt.log.ok('Delayed live reload successful.')
        } else {
          grunt.log.error('Unable to make a delayed live reload.')
        }
        done(reloaded)
      })
    }, 500)
  })

  grunt.registerTask('watch-server', ['concurrent:dev'])
}
