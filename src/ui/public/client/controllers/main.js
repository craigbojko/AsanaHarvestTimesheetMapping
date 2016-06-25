/**
* @Author: craigbojko
* @Date:   2016-06-20T00:08:34+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-23T12:35:22+01:00
*/

module.exports = function ($scope, $rootScope, $http) {
  $scope.dataLoaded = false

  $rootScope.$on('asanaTasksLoadedEvent', function (event, data) {
    $scope.dataLoaded = true
  })
}
