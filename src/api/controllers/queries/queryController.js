/**
* @Author: craigbojko
* @Date:   2016-05-16T10:02:17+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-19T19:43:23+01:00
*/

var TimesheetMapModel = require('../../mongo').mapTimesheets

module.exports = {
  getAllTimesheetsByAsanaId: getAllTimesheetsByAsanaId
}

function getAllTimesheetsByAsanaId (asanaId, cb) {
  TimesheetMapModel.find({
    'asanaId': asanaId
  }).exec(function (err, doc) {
    if (err) {
      console.log(err)
      cb(err)
    } else {
      cb(doc)
    }
  })
}
