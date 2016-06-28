/**
* @Author: craigbojko
* @Date:   2016-06-20T00:08:34+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-26T21:58:38+01:00
*/

module.exports = function ($scope, $rootScope, $http) {
  $scope.dataLoaded = false
  $scope.public = __nodeHandoff.public

  $rootScope.$on('asanaTasksLoadedEvent', function (event, data) {
    $scope.dataLoaded = true
  })
}
