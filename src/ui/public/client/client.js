/**
* @Author: craigbojko
* @Date:   2016-06-19T23:51:47+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-23T16:54:35+01:00
*/

// require('bootstrap/dist/css/bootstrap.css')
require('!style!css!../styles/tsAggregation.css')

var angular = require('angular')
var mainController = require('./controllers/main')
var asanaTaskController = require('./controllers/asanaTaskController')
var queryController = require('./controllers/queryController')
var aggregaterController = require('./controllers/aggregaterController')

require('angular-route')
require('angular-sanitize')

angular
  .module('HAMapperApp', ['ngRoute', 'ngSanitize'])
  .factory('Scopes', function ($rootScope) {
    return $rootScope
  })
  .controller('MainCtrl', mainController)
  .controller('AsanaTaskController', asanaTaskController)
  .controller('QueryController', queryController)
  .controller('AggregaterController', aggregaterController)
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: window.__nodeHandoff.angularRoute + '/views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      })
  }])
