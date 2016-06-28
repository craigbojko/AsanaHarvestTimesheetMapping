/**
* @Author: craigbojko
* @Date:   2016-05-16T10:02:17+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-26T14:54:11+01:00
*/

var TimesheetMapModel = require('../../mongo').mapTimesheets

module.exports = {
  getAllTimesheetsByAsanaId: getAllTimesheetsByAsanaId
}

function getAllTimesheetsByAsanaId (asanaId, taskId, cb) {
  TimesheetMapModel.find({
    'asanaId': taskId
  }).exec(function (err, doc) {
    if (err) {
      console.log(err)
      cb(err)
    } else {
      cb(doc)
    }
  })
}
