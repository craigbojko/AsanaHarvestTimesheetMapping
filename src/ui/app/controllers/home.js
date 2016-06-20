/**
* @Author: craigbojko
* @Date:   2016-03-20T20:49:52+00:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-20T11:06:46+01:00
*/

var base = '../../../'
var api = require(base + 'api/controllers/apiFuncs')

function homepage (req, res) {
  api.homeEndpoint({
    name: 'Betfair'
  }, function (resp) {
    res.render('home/index', {
      title: 'Qubit Harvest-Asana Mapper - Test',
      public: 'http://localhost/projects/Qubit HarvestAsana Mapper/src/ui/public/',
      build: 'http://localhost/projects/Qubit HarvestAsana Mapper/build/',
      resp: JSON.stringify(resp)
    })
  })
}

module.exports.index = homepage
