/**
* @Author: craigbojko
* @Date:   2016-06-19T23:51:47+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-20T00:08:58+01:00
*/

// require('bootstrap/dist/css/bootstrap.css')
// require('!style!css!../styles/main.css')

var angular = require('angular')
var mainController = require('./controllers/main')

require('angular-route')

angular
  .module('HAMapperApp', ['ngRoute'])
  .factory('Scopes', function ($rootScope) {
    return $rootScope
  })
  .controller('MainCtrl', mainController)
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      })
  })
