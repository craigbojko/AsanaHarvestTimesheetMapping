/**
* @Author: craigbojko
* @Date:   2016-04-20T22:40:28+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-19T19:06:18+01:00
*/

var AsanaProjectController = require('../controllers/asana/asanaProjectController')
var AsanaTaskController = require('../controllers/asana/asanaTaskController')
var MapperHAProjects = require('../controllers/mappers/harvestAsanaProjects')

// Asana Controller Stubs
// API.prototype.getAsanaProjectList = AsanaProjectController.getAsanaProjectList
// API.prototype.persistAsanaProjects = AsanaProjectController.persistAsanaProjects
// API.prototype.getAsanaProjectManifest = AsanaTaskController.getAsanaProjectManifest
// API.prototype.getAsanaTasksWithProjectId = AsanaTaskController.getAsanaTasksWithProjectId

module.exports = {
  asanaProjects: asanaProjects,
  getAsanaProjectTasks: getAsanaProjectTasks,
  getAsanaProjectTasksFiltered: getAsanaProjectTasksFiltered,
  getAsanaTimesheetsForDate: getAsanaTimesheetsForDate,
  getAsanaTimesheetsForManifest: getAsanaTimesheetsForManifest
}

function asanaProjects (req, res) {
  AsanaProjectController.getAsanaProjectList(function (resp) {
    console.log('PROJECTS FOUND: ', resp.length)
    res.json(resp)
    if (req.params.update && req.params.update === 'update') {
      console.log('PERSISTING PROJECTS INFO TO MONGO DB'.yellow)
      AsanaProjectController.persistAsanaProjects(resp, function (nums) {
        console.log('PERSISTING COMPLETE: ASANA PROJECTS INFO.'.green)
        console.log(nums)
      })
    }
    return
  })
}

function getAsanaProjectTasks (req, res) {
  AsanaTaskController.getAsanaProjectManifest().then(function (resp) {
    if (!resp) {
      res.status(404)
      res.send({ error: 'Not found' })
    } else {
      res.status(200)
      res.send(resp)
      console.log('NUMBER PROJECT TASKS FOUND: ', resp.length)
    }
  })
}

function getAsanaProjectTasksFiltered (req, res) {
  AsanaTaskController.getAsanaTasksWithProjectId().then(function (resp) {
    if (!resp) {
      res.status(404)
      res.send({ error: 'Not found' })
    } else {
      res.status(200)
      res.send(resp)
      console.log('NUMBER PROJECT TASKS FOUND: ', resp.length)
    }
  })
}

function getAsanaTimesheetsForDate (req, res) {
  MapperHAProjects.requestTimsheetFromAsana(req.params.date, req.params.asanaProjectId).then(function (resp) {
    if (!resp) {
      res.status(404)
      res.send({ error: 'Timesheets Not found' })
    } else {
      if (req.params.filtered) {
        // console.log('TIMESHEETS FOUND: ', resp.data.data)
        console.log('RUNNING TASK MAPPING...')
        var mapResp = MapperHAProjects.mapTaskToTimesheet(resp.data.data)
        if (req.params.save) {
          MapperHAProjects.persistMappedTimesheet(mapResp, function (data) {
            res.status(200)
            res.send(data)
          })
        } else {
          res.status(200)
          res.send(mapResp)
        }
      } else {
        // console.log('TIMESHEETS FOUND: ', resp.data.data)
        res.status(200)
        res.send(resp.data.data)
      }
    }
  }, function (err) {
    res.status(404)
    res.send({ error: err })
  })
}

function getAsanaTimesheetsForManifest (req, res, next) { // TODO -  expand to full manifest
  AsanaTaskController.getAsanaTasksWithProjectId().then(function (resp) {
    if (!resp) {
      res.status(404)
      res.send({ error: 'Not found' })
    } else {
      var _id = parseInt(req.params.asanaProjectId, 10)
      var selected = resp[0]

      if (_id) {
        for (var i = 0; i < resp.length; i++) {
          if (resp[i].projectId === _id) {
            selected = resp[i]
          }
        }
      }

      console.log('NUMBER PROJECT TASKS FOUND: ', resp.length)
      console.log('SELECTED PROJECT: ', selected)

      req.params.date = '2016-05-10'
      req.params.asanaProjectId = selected.projectId
      getAsanaTimesheetsForDate(req, res, next)
    }
  })
}
