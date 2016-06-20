/**
* @Author: craigbojko
* @Date:   2016-04-03T02:34:07+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-19T23:59:42+01:00
*/

var axios = require('axios')
var hublUrls = require('config/hublUrls')
var Promise = require('promise')

var HarvestTimesheetModel = require('../../mongo').harvestTimesheets

var timesheetsPersisted = 0
var timesheetsUpdated = 0

module.exports = {
  getHarvestTimesheetList: getHarvestTimesheetList,
  persistHarvestTimesheetList: persistHarvestTimesheetList
}

function getHarvestTimesheetList (pid, start, end, cb) {
  var url = hublUrls.harvest.timesheet
  url = url
    .replace('{{projectid}}', pid)
    .replace('{{datestart}}', start)
    .replace('{{dateend}}', end)

  axios.get(url)
    .then(function (response) {
      cb(response)
    })
    .catch(function (error) {
      console.error(error)
      cb(error)
    })
}

function persistHarvestTimesheetList (data, cb) {
  var promiseArr = []

  for (var i = 0; i < data.length; i++) {
    console.log('HARVEST TIMESHEET: %s', data[i].id)
    promiseArr.push(threadHarvestTimesheetPersistence(data[i]))
  }

  Promise.all(promiseArr).then(function (counts) {
    console.log('ALL PROMISES COMPLETED: RUNNING CALLBACK')
    cb({
      // updated: counts.timesheetsUpdated,
      // persisted: counts.timesheetsPersisted
      counts: counts[counts.length - 1]
    })
  }, function (error) {
    console.error(error)
  })
}

function threadHarvestTimesheetPersistence (harvestTimesheet) {
  return new Promise(function (resolve, reject) {
    HarvestTimesheetModel.findOne({
      $or: [
        {
          'harvest_id': harvestTimesheet.id
        }
      ]
    }).exec(function (err, doc) {
      if (err) {
        reject(err)
      } else {
        // persistHarvestTimesheet(doc, harvestTimesheet)
        if (doc) { // update
          console.log('FOUND HARVEST TIMESHEET: %s', doc.id)
          updateHarvestTimesheet(doc, harvestTimesheet, resolve, reject)
        } else { // save new
          console.log('SAVING HARVEST TIMESHEET: %s', harvestTimesheet.id)
          insertHarvestTimesheet(harvestTimesheet, resolve, reject)
        }
      }
    })
  })
}

function updateHarvestTimesheet (timesheetDoc, harvestTimesheet, resolve, reject) {
  timesheetDoc.harvest_id = harvestTimesheet.client_id
  timesheetDoc.client_id = harvestTimesheet.client_id
  timesheetDoc.name = harvestTimesheet.name
  timesheetDoc.created_at = harvestTimesheet.created_at
  timesheetDoc.save(function () {
    timesheetsUpdated++
    resolve({
      timesheetsUpdated: timesheetsUpdated,
      timesheetsPersisted: timesheetsPersisted
    })
  })
}

function insertHarvestTimesheet (harvestTimesheet, resolve, reject) {
  HarvestTimesheetModel.create({
    harvest_id: harvestTimesheet.client_id,
    client_id: harvestTimesheet.client_id,
    name: harvestTimesheet.name,
    created_at: harvestTimesheet.created_at
  }, function (err) {
    if (err) {
      console.error('ERROR IN PERSISTING HARVEST TIMESHEET: %s :: ', harvestTimesheet.id, err)
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
