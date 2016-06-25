/**
* @Author: craigbojko
* @Date:   2016-04-11T14:23:11+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-25T19:54:22+01:00
*/

var axios = require('axios')
var Promise = require('promise')
var hublUrls = require('config/hublUrls')

var MapProjectModel = require('../../mongo').mapProjectIds

var TimesheetPersistance = require('./persist/timesheet')
var ProjectPersistance = require('./persist/project')

module.exports = {
  mapSystemProjectIds: mapSystemProjectIds,
  mapTaskToTimesheet: mapTaskToTimesheet,
  requestTimsheetFromAsana: requestTimsheetFromAsana,
  persistProjectIdMapping: ProjectPersistance.persistProjectIdMapping,
  persistMappedTimesheet: TimesheetPersistance.persistMappedTimesheet
}

function mapSystemProjectIds () {
  // TODO - make bulk mapping function
}

function mapTaskToTimesheet (data) {
  var _data = data
  var timesheetNotes = []
  var asanaTaskIds = {}

  for (var i = 0; i < _data.length; i++) {
    if (data[i].notes) {
      timesheetNotes.push(data[i].notes)
      var asanaId = data[i].notes.match(/https?:\/\/app.asana.com\/([0-9a-z].*)\/([0-9a-z].*)/i)

      if (asanaId && asanaId.length > 1) {
        if (asanaTaskIds[asanaId[2]]) {
          asanaTaskIds[asanaId[2]].push(_data[i])
        } else {
          asanaTaskIds[asanaId[2]] = []
          asanaTaskIds[asanaId[2]].push(_data[i])
        }
      }
    }
  }

  return asanaTaskIds
}

function requestTimsheetFromAsana (date, asanaId) {
  var currentDate = new Date(date)
  var dateStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 2, 0, 0)
  var dateEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 2, 0, 0)
  var start = dateStart.toISOString()
  var end = dateEnd.toISOString()

  return new Promise(function (resolve, reject) {
    var harvestIdPromise = getHarvestIdFromAsanaId(asanaId)
    harvestIdPromise.then(function (data) {
      getHarvestTimesheet(data.harvestId, start, end, resolve, reject)
    }, function (err) {
      reject(err)
    })
  })
}

function getHarvestIdFromAsanaId (asanaId) {
  return new Promise(function (resolve, reject) {
    MapProjectModel.findOne({
      'asanaId': asanaId
    }).exec(function (err, doc) {
      if (err) {
        reject(err)
      } else {
        if (doc) {
          console.log('FOUND MAP: %s', doc.id)
          resolve(doc)
        } else {
          console.log('NO ID MAPPING FOUND: %s', asanaId)
          reject('NO ID MAPPING FOUND: ' + asanaId)
        }
      }
    })
  })
}

function getHarvestTimesheet (pid, start, end, resolve, reject) {
  var url = hublUrls.harvest.timesheet
  url = url
    .replace('{{projectid}}', pid)
    .replace('{{datestart}}', start)
    .replace('{{dateend}}', end)

  axios.get(url)
    .then(function (response) {
      resolve(response)
    })
    .catch(function (error) {
      console.error(error)
      reject(error)
    })
}
