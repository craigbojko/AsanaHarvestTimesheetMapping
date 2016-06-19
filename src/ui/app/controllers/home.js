/**
* @Author: craigbojko
* @Date:   2016-03-20T20:49:52+00:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-19T19:23:40+01:00
*/

// var base = '../../../'
// var api = require(base + 'api/controllers/apiFuncs')

function homepage (req, res) {
  // api.processHome({
  //   name: 'Betfair'
  // }, function (resp) {
  res.render('home/index', {
    title: 'Generator-Express MVC',
    public: 'http://localhost/projects/Qubit HarvestAsana Mapper/src/ui/public/' // ,
  // resp: JSON.stringify(resp)
  })
// })
}

module.exports.index = homepage
