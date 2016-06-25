/**
* @Author: craigbojko
* @Date:   2016-03-20T20:49:52+00:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-21T00:17:22+01:00
*/

var request = require('request')

module.exports = function (grunt) {
  require('time-grunt')(grunt)
  require('load-grunt-tasks')(grunt)

  var reloadPort = 35729
  var files

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    standard: {
      extension: {
        options: {
          format: false
        },
        src: [
          'src/**/*.js'
        ]
      }
    },
    concurrent: {
      main: [
        'watch-server',
        'watch-client',
        'webpack'
      ],
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
          ignore: [
            '.git',
            'node_modules/**/node_modules',
            './build/client',
            './src/ui/public'
          ],
          events: {
            restart: 'osascript -e "display notification \'App restarted due to:\n\'$FILENAME\'\' with title \'nodemon"'
          },
          // watch: [
          //   './app.js',
          //   './config/**',
          //   './routes/**',
          //   './test/**',
          //   './src/api/**'
          // ],
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour)
            })
            nodemon.on('config:update', function () {
              setTimeout(function () {
                require('open')('http://localhost:5100')
              }, 1000)
            })
            nodemon.on('restart', function () {
              setTimeout(function () {
                console.log('WRITING REBOOTED')
                require('fs').writeFileSync('.rebooted', new Date().getTime().toString())
              }, 1000)
            })
          }
        }
      }
    },
    watch: {
      server: {
        files: [
          '.rebooted'
        ],
        tasks: ['lint'],
        options: {
          livereload: false
        }
      },
      client: {
        files: [
          '.rebooted', // For server updates
          './src/ui/**/*.html',
          './src/ui/**/*.css',
          './src/ui/js/**',
          './build/client/**'
        ],
        tasks: ['lint', 'delayed-livereload'],
        options: {
          livereload: true
        }
      }
    },
    webpack: {
      dev: require('./webpack.config.js')
    }
  })

  grunt.config.requires('watch.client.files')
  files = grunt.config('watch.client.files')
  files = grunt.file.expand(files)

  grunt.loadNpmTasks('grunt-nodemon')
  grunt.loadNpmTasks('grunt-concurrent')
  grunt.loadNpmTasks('grunt-standard')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    console.log('RUNNING LIVERELOAD')
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

  grunt.registerTask('lint', []) // 'standard'
  grunt.registerTask('watch-server', ['nodemon:dev', 'watch:server'])
  grunt.registerTask('watch-client', ['watch:client'])
  grunt.registerTask('develop', ['concurrent:main'])
  grunt.registerTask('build-client', ['webpack'])
}
