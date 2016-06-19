/**
* @Author: craigbojko
* @Date:   2016-03-20T20:49:52+00:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-19T19:21:16+01:00
*/

var db = require('../mongo')

module.exports = {
  homeEndpoint: homeEndpoint
}

// UI Specific API endpoint stubs
function homeEndpoint (asanaQuery, callback) {
  db.asanaProjects.find(asanaQuery, function (err, docs) {
    if (err) {
      callback({
        response: false,
        status: 500,
        type: 'api',
        subtype: 'homepage_error',
        error: err
      })
    }

    // docs.forEach
    callback({
      response: true,
      status: 200,
      type: 'api',
      subtype: 'homepage_found',
      results: docs
    })
  })
}
