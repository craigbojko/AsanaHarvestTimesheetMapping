/**
* @Author: craigbojko
* @Date:   2016-06-21T15:42:04+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-23T12:26:18+01:00
*/

var __rootScope

module.exports = function ($scope, $rootScope, $http) {
  __rootScope = $rootScope
  $scope.dataLoaded = true

  $scope.selected = -1
  $scope.select = function (index) {
    $scope.selected = index
  }

  getAsanaTasks($http, function (tasks) {
    $rootScope.$emit('asanaTasksLoadedEvent', tasks)
    $scope.asanaTasks = tasks
    $scope.dataLoaded = true
  })

  $scope.loadTaskTimesheets = execTaskTimesheets
}

function execTaskTimesheets ($event, task) {
  __rootScope.$emit('execTimesheetRequest', task)
}

function getAsanaTasks ($http, cb) {
  var url = window.__nodeHandoff.endpoints.asanaTasks
  $http.get(url).success(function (data) {
    cb(data)
  })
}
