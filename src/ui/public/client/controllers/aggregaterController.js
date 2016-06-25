/**
* @Author: craigbojko
* @Date:   2016-06-23T12:49:38+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-23T13:32:25+01:00
*/

var $controllerScope
var $$rootScope
var currentTimesheets = []

module.exports = function ($scope, $rootScope) {
  $controllerScope = $scope
  $$rootScope = $rootScope

  $scope.timesheetsLoaded = false
  currentTimesheets = []

  $rootScope.$on('timesheetsLoaded', function (event, data) {
    currentTimesheets = data
    $scope.timesheetsLoaded = true
    aggregateTimesheets(data)
  })
}

function aggregateTimesheets (timesheets) {
  var totalTimeSpent = 0
  var timeSpentToday = 0
  var now = new Date()
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  // var today = new Date(2016, 5, 9, 0, 0, 0, 0)

  timesheets.forEach(function (element) {
    var timeSpent = element.hours
    var spentAt = element.spent_at
    var spentAtDate = new Date(spentAt)
    spentAtDate.setHours(0)
    spentAtDate.setMinutes(0)
    spentAtDate.setSeconds(0)
    spentAtDate.setMilliseconds(0)

    if (spentAtDate.getTime() === today.getTime()) {
      timeSpentToday += timeSpent
    }
    totalTimeSpent += timeSpent
  })

  $controllerScope.totalTimeSpent = totalTimeSpent
  $controllerScope.timeSpentToday = timeSpentToday
}
