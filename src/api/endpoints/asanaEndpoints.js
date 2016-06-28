/**
* @Author: craigbojko
* @Date:   2016-04-20T22:40:28+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-27T12:21:29+01:00
*/

var Promise = require('promise')

var AsanaProjectController = require('../controllers/asana/asanaProjectController')
var AsanaTaskController = require('../controllers/asana/asanaTaskController')
var MapperHAProjects = require('../controllers/mappers/harvestAsanaProjects')

module.exports = {
  asanaProjects: asanaProjects,
  getAsanaProjectTasks: getAsanaProjectTasks,
  getAsanaProjectTasksFiltered: getAsanaProjectTasksFiltered,
  getAsanaTimesheetsForDate: getAsanaTimesheetsForDate,
  getAsanaTimesheetsForManifest: getAsanaTimesheetsForManifest,
  getTimesheetsForMonthForProject: getTimesheetsForMonthForProject
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
  AsanaTaskController.getFullAsanaProjectManifest().then(function (resp) {
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
  AsanaTaskController.getParsedAsanaTasks().then(function (resp) {
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
  getTimesheetForDate(
    req.params.asanaProjectId,
    req.params.date,
    req.params.filtered,
    req.params.save
  ).then(function (data) {
    res.status(200)
    res.send(data)
  }, function (err) {
    res.status(404)
    res.send({
      error: err
    })
  })
}

function getAsanaTimesheetsForManifest (req, res, next) { // TODO -  expand to full manifest
  AsanaTaskController.getParsedAsanaTasks().then(function (resp) {
    if (!resp) {
      res.status(404)
      res.send({
        error: 'Not found'
      })
    } else {
      var count = 0
      var projArr = []
      console.log('NUMBER PROJECT TASKS FOUND: ', resp.length)
      for (var i = 0; i < resp.length; i++) {
        console.log('SELECTED TASK: ', resp[i])

        ;(function closureFunc (selected) {
          req.params.asanaProjectId = selected.projectId
          req.params.persist = true
          var res = {
            status: 0,
            send: {}
          }
          getTimesheetsForMonthForProject(req, res, next)
          projArr.push(selected.projectId)
          count++
        }(resp[i]))
      }
      res.status(200)
      res.send({
        count: count,
        projects: projArr
      })
    }
  })
}

function getTimesheetsForMonthForProject (req, res, next) {
  var projectId = req.params.asanaProjectId
  var persist = req.params.save
  var monthArr = []
  for (var i = 0; i < 31; i++) { // 30
    monthArr.push(threadGetTimesheetForDate(projectId, i, persist))
  }

  Promise.all(monthArr.map(function (timesheet) { // settle if reject
    return timesheet.catch(function (err) {
      console.log('ERROR HANDLED IN PROMISE.ALL: ', err)
      return err
    })
  })).then(function (data) {
    res.status(200)
    if (persist) {
      res.send(data) // TODO try to determine last count result
    } else {
      res.send(data)
    }
  }, function (err) {
    console.log(err)
    res.status(400)
    res.send({
      status: 400,
      error: err.message
    })
  })
}

function threadGetTimesheetForDate (asanaId, i, persist) {
  return new Promise(function (resolve, reject) {
    var now = new Date()
    var beginDate = new Date(now.getTime() - 2592000000) // 30 days
    var currDate = beginDate.getTime() + (86400000 * i) // 1 day
    var d = new Date(currDate)
    var dateStr = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()

    console.log('REQUESTING TIMESHEET:: DATE: %s PROJECT: %s', dateStr, asanaId)
    // monthArr.push(threadGetTimesheetForDate(projectId, dateStr, true))
    getTimesheetForDate(asanaId, dateStr, true, persist).then(function (data) {
      resolve(data)
    }, function (err) {
      reject(err)
    })
  })
}

/**
 * Main Function that gets Timesheets for Asana Task
 *  - calls Mapper function to get Harvest Timesheets for date
 *  - once all timesheets acquired - filters for timesheets with notes containing the asana id
 * @param  {[int]} asanaId  [Asana Task ID]
 * @param  {[string]} date     [Date string YYYY-MM-DD]
 * @param  {[boolean]} filtered [Filters for timesheets containing notes]
 * @param  {[boolean]} save     [Sets to persist to DB]
 * @return {[promise]}          [Promise response]
 */
function getTimesheetForDate (asanaId, date, filtered, save) {
  return new Promise(function (resolve, reject) {
    MapperHAProjects.requestTimsheetFromAsana(date, asanaId).then(function (resp) {
      if (!resp) {
        reject({
          error: 'Timesheets Not found'
        })
      } else {
        if (filtered) {
          // console.log('TIMESHEETS FOUND: ', resp.data.data)
          console.log('RUNNING TASK MAPPING: %s', asanaId)
          var mapResp = MapperHAProjects.mapTaskToTimesheet(resp.data.data)
          if (save) {
            MapperHAProjects.persistMappedTimesheet(mapResp, function (data) {
              resolve(data)
            })
          } else {
            resolve(mapResp)
          }
        } else {
          // console.log('TIMESHEETS FOUND: ', resp.data.data)
          resolve(resp.data.data)
        }
      }
    }, function (err) {
      reject({
        error: err
      })
    })
  })
}
