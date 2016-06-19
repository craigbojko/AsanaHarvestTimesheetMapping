/**
* @Author: craigbojko
* @Date:   2016-04-11T14:23:11+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-19T19:06:25+01:00
*/

var axios = require('axios')
var Promise = require('promise')
var hublUrls = require('config/hublUrls')

var TimesheetModel = require('../../mongo').harvestTimesheets
var AsanaProjectsModel = require('../../mongo').asanaProjects
var HarvestProjectsModel = require('../../mongo').harvestProjects
var MapProjectModel = require('../../mongo').mapProjectIds

var projectsPersisted = 0
var projectsUpdated = 0
var timesheetsPersisted = 0
var timesheetsUpdated = 0

module.exports = {
  mapSystemProjectIds: mapSystemProjectIds,
  getAsanaProjectByName: getAsanaProjectByName,
  getAsanaProjectById: getAsanaProjectById,
  getHarvestProjectByName: getHarvestProjectByName,
  persistProjectIdMapping: persistProjectIdMapping,
  requestTimsheetFromAsana: requestTimsheetFromAsana,
  mapTaskToTimesheet: mapTaskToTimesheet,
  persistMappedTimesheet: persistMappedTimesheet
}

function mapSystemProjectIds () {
  // TODO - make bulk mapping function
}

function persistProjectIdMapping (projectData) {
  return new Promise(function (resolve, reject) {
    if (projectData.length !== 2 && projectData[0].length && projectData[1].length) {
      reject({error: "projectData doesn't seem to have enough data"})
    }

    threadMapProjectPersistence(projectData[1], projectData[0]).then(function (data) {
      resolve(data)
    }, function (err) {
      reject(err)
    })
  })
}

function threadMapProjectPersistence (asanaProject, harvestProject) {
  return new Promise(function (resolve, reject) {
    MapProjectModel.findOne({
      $or: [
        {
          'asanaId': asanaProject.id
        }
      ]
    }).exec(function (err, doc) {
      if (err) {
        reject(err)
      } else {
        if (doc) { // update
          console.log('FOUND PROJECT MAPPING: %s', doc.id)
          updateProjectMap(doc, asanaProject, harvestProject, resolve, reject)
        } else { // save new
          console.log('SAVING PROJECT MAPPING: %s', harvestProject.harvestId)
          insertProjectMap(asanaProject, harvestProject, resolve, reject)
        }
      }
    })
  })
}

function updateProjectMap (projectDoc, asanaProject, harvestProject, resolve, reject) {
  projectDoc.harvestId = harvestProject.harvest_id
  projectDoc.clientId = harvestProject.client_id
  projectDoc.asanaId = asanaProject.id
  projectDoc.name = asanaProject.name
  projectDoc.save(function () {
    projectsUpdated++
    resolve({
      projectsUpdated: projectsUpdated,
      projectsPersisted: projectsPersisted
    })
  })
}

function insertProjectMap (asanaProject, harvestProject, resolve, reject) {
  MapProjectModel.create({
    harvestId: harvestProject.harvest_id,
    clientId: harvestProject.client_id,
    asanaId: asanaProject.id,
    name: asanaProject.name
  }, function (err) {
    if (err) {
      console.error('ERROR IN PERSISTING HARVEST PROJECT: %s :: ', harvestProject.id, err)
      reject(err)
    } else {
      projectsPersisted++
      resolve({
        projectsUpdated: projectsUpdated,
        projectsPersisted: projectsPersisted
      })
    }
  })
}

function getHarvestProjectByName (name) {
  return new Promise(function (resolve, reject) {
    HarvestProjectsModel.find({
      $or: [
        {
          'name': new RegExp('^' + name + '$', 'i')
        }
      ]
    }).exec(function (err, doc) {
      if (err) {
        reject(err)
      } else {
        if (doc) {
          resolve(doc)
        } else {
          reject(null)
        }
      }
    })
  })
}

function getAsanaProjectByName (name) {
  return new Promise(function (resolve, reject) {
    AsanaProjectsModel.find({
      $or: [
        {
          'name': new RegExp('^' + name + '$', 'i')
        }
      ]
    }).exec(function (err, doc) {
      if (err) {
        reject(err)
      } else {
        if (doc) {
          resolve(doc)
        } else {
          reject(null)
        }
      }
    })
  })
}

function getAsanaProjectById (id) {
  return new Promise(function (resolve, reject) {
    AsanaProjectsModel.findOne({
      $or: [
        {
          'id': id
        }
      ]
    }).exec(function (err, doc) {
      if (err) {
        reject(err)
      } else {
        if (doc) {
          resolve(doc)
        } else {
          reject(null)
        }
      }
    })
  })
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
      $or: [
        {
          'asanaId': asanaId
        }
      ]
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

function mapTaskToTimesheet (data) {
  var _data = data
  var timesheetNotes = []
  var asanaTaskIds = {}

  for (var i = 0; i < _data.length; i++) {
    timesheetNotes.push(data[i].notes)
    var asanaId = data[i].notes.match(/https?:\/\/app.asana.com\/([0-9a-z].*)\/([0-9a-z].*)/i)

    if (asanaId && asanaId.length > 1) {
      asanaTaskIds[asanaId[2]] = _data[i]
    }
  }

  return asanaTaskIds
}

function persistMappedTimesheet (data, cb) {
  var promiseArr = []
  var asanaIds = Object.keys(data)

  for (var i = 0; i < asanaIds.length; i++) {
    console.log('ASANA TASK: %s', asanaIds[i])
    promiseArr.push(threadTimesheetPersistence(data[asanaIds[i]], asanaIds[i]))
  }

  Promise.all(promiseArr).then(function (counts) {
    console.log('ALL PROMISES COMPLETED: RUNNING CALLBACK')
    cb({
      // updated: counts.usersUpdated,
      // persisted: counts.usersPersisted
      counts: counts[counts.length - 1]
    })
  }, function (error) {
    console.error(error)
  })
}

function threadTimesheetPersistence (timesheet, asanaId) {
  return new Promise(function (resolve, reject) {
    TimesheetModel.findOne({
      $and: [
        {
          'asanaId': asanaId
        }, {
          'id': timesheet.id
        }
      ]
    }).exec(function (err, doc) {
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
  timesheetDoc.id = timesheet.id
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
  TimesheetModel.create({
    asanaId: asanaId,
    id: timesheet.id,
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
      console.error('ERROR IN PERSISTING TIMESHEET: %s :: ', timesheet.id, err)
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
