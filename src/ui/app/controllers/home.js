/**
* @Author: craigbojko
* @Date:   2016-03-20T20:49:52+00:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-22T23:42:47+01:00
*/

// var base = '../../../'
// var api = require(base + 'api/controllers/apiFuncs')

var env = 'http://localhost'
var port = 5100
var API_ROUTE = env + ':' + port + '/api/'
var UI_ROUTE = env + ':' + port + '/ui/'
var ANGULAR_ROUTE = env + ':' + port + '/angular'
var BUILD_ROUTE = env + '/projects/Qubit%20HarvestAsana%20Mapper/build/'

function homepage (req, res) {
  // api.homeEndpoint({
  //   name: 'Betfair'
  // }, function (resp) {
  res.render('home/index', {
    title: 'Qubit Harvest-Asana Mapper',
    public: env + '/projects/Qubit HarvestAsana Mapper/src/ui/public/',
    build: BUILD_ROUTE,
    handoff: JSON.stringify({
      api: API_ROUTE,
      angularRoute: ANGULAR_ROUTE,
      endpoints: {
        asanaTasks: API_ROUTE + 'asana/tasks/get/filtered',
        queryTimesheets: API_ROUTE + 'query/all'
      }
    })
  // resp: JSON.stringify(resp)
  })
// })
}

module.exports.index = homepage
