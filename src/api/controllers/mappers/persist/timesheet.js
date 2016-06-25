/**
* @Author: craigbojko
* @Date:   2016-06-25T19:42:06+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-25T20:01:49+01:00
*/

var Promise = require('promise')

var MapTimesheetModel = require('../../../mongo').mapTimesheets

var timesheetsPersisted = 0
var timesheetsUpdated = 0

module.exports = {
  persistMappedTimesheet: persistMappedTimesheet
}

function persistMappedTimesheet (data, cb) {
  var promiseArr = []
  var asanaIds = Object.keys(data)

  for (var i = 0; i < asanaIds.length; i++) {
    console.log('ASANA TASK: %s', asanaIds[i])
    for (var j = 0; j < data[asanaIds[i]].length; j++) {
      var timesheet = data[asanaIds[i]][j]
      console.log('TIMESHEET: ', timesheet)
      promiseArr.push(threadTimesheetPersistence(timesheet, asanaIds[i]))
    }
  }

  Promise.all(promiseArr).then(function (counts) {
    console.log('ALL PROMISES COMPLETED: RUNNING CALLBACK')
    cb({
      // updated: counts.usersUpdated,
      // persisted: counts.usersPersisted
      counts: counts[counts.length - 1]
    })
  }, function (error) {
    console.log(error)
  })
}

function threadTimesheetPersistence (timesheet, asanaId) {
  return new Promise(function (resolve, reject) {
    MapTimesheetModel.findOne({
      $and: [
        {
          'asanaId': asanaId
        }, {
          'timesheetId': timesheet.id
        }
      ]
    }, {_id: 0}).exec(function (err, doc) {
      if (err) {
        reject(err)
      } else {
        if (doc) { // update
          console.log('FOUND TIMESHEET: %s', doc.id)
          updateTimesheet(doc, timesheet, asanaId, resolve, reject)
        } else { // save new
          console.log('SAVING TIMESHEET: %s', asanaId)
          insertTimesheet(timesheet, asanaId, resolve, reject)
        }
      }
    })
  })
}

function updateTimesheet (timesheetDoc, timesheet, asanaId, resolve, reject) {
  timesheetDoc.asanaId = asanaId
  timesheetDoc.timesheetId = timesheet.id
  timesheetDoc.notes = timesheet.notes
  timesheetDoc.spent_at = timesheet.spent_at
  timesheetDoc.hours = timesheet.hours
  timesheetDoc.user_id = timesheet.user_id
  timesheetDoc.project_id = timesheet.project_id
  timesheetDoc.task_id = timesheet.task_id
  timesheetDoc.created_at = timesheet.created_at
  timesheetDoc.updated_at = timesheet.updated_at
  timesheetDoc.user_department = timesheet.user_department
  timesheetDoc.task_type = timesheet.task_type
  timesheetDoc.save(function () {
    timesheetsUpdated++
    resolve({
      timesheetsUpdated: timesheetsUpdated,
      timesheetsPersisted: timesheetsPersisted
    })
  })
}

function insertTimesheet (timesheet, asanaId, resolve, reject) {
  MapTimesheetModel.create({
    asanaId: asanaId,
    timesheetId: timesheet.id,
    notes: timesheet.notes,
    spent_at: timesheet.spent_at,
    hours: timesheet.hours,
    user_id: timesheet.user_id,
    project_id: timesheet.project_id,
    task_id: timesheet.task_id,
    created_at: timesheet.created_at,
    updated_at: timesheet.updated_at,
    user_department: timesheet.user_department,
    task_type: timesheet.task_type
  }, function (err) {
    if (err) {
      console.log('ERROR IN PERSISTING TIMESHEET: %s :: ', timesheet.id, err)
      reject(err)
    } else {
      timesheetsPersisted++
      resolve({
        timesheetsUpdated: timesheetsUpdated,
        timesheetsPersisted: timesheetsPersisted
      })
    }
  })
}
