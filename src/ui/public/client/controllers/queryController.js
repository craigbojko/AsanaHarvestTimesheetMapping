/**
* @Author: craigbojko
* @Date:   2016-06-22T23:14:46+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-26T22:08:36+01:00
*/

var $controllerScope
var $$rootScope

module.exports = function ($scope, $rootScope, $http) {
  $controllerScope = $scope
  $$rootScope = $rootScope

  $rootScope.$on('asanaTasksLoadedEvent', function (event, data) {
    $scope.asanaTasks = data
  })

  $rootScope.$on('execTimesheetRequest', function (event, data) {
    requestTimesheetData(data, $http)
  })
}

function requestTimesheetData (task, $http) {
  console.group(task.name)
  console.table([task])
  console.groupEnd()

  var url = window.__nodeHandoff.endpoints.queryTimesheets + '/' + task.projectId + '/' + task.id
  $http.get(url).success(function (data) {
    var timesheets = []
    data.forEach(function (element) {
      timesheets.push(syntaxHighlight(JSON.stringify(element, null, '  ')))
    })
    $controllerScope.timesheets = timesheets
    $$rootScope.$emit('timesheetsLoaded', data)

    window.__main.setSizeManual()
  })
}

function syntaxHighlight (json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number'
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key'
      } else {
        cls = 'string'
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean'
    } else if (/null/.test(match)) {
      cls = 'null'
    }
    return '<span class="' + cls + '">' + match + '</span>'
  })
}
