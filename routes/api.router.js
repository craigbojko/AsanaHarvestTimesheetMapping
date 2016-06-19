/**
* @Author: craigbojko
* @Date:   2016-03-20T20:49:52+00:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-19T19:22:07+01:00
*/

require('colors')
var express = require('express')
var expressAPI = express.Router()

var api = require('../src/api/controllers/apiFuncs')
var HarvestEndpoints = require('../src/api/endpoints/harvestEndpoints')
var AsanaEndpoints = require('../src/api/endpoints/asanaEndpoints')
var MapperEndpoints = require('../src/api/endpoints/mapperEndpoints')
var QueryEndpoints = require('../src/api/endpoints/queryEndpoints')

expressAPI.use(function (req, res, next) {
  console.log('URL REQUESTED: %s'.cyan, req.url)
  next()
})

expressAPI.get('/', function (req, res) {
  api.homeEndpoint({name: 'Betfair'}, function (resp) {
    res.json({
      route: '/',
      response: 'OK test',
      resp: resp
    })
  })
})

expressAPI.get('/harvest', HarvestEndpoints.harvest)
expressAPI.get('/harvest/users/:update?', HarvestEndpoints.harvestUsers)
expressAPI.get('/harvest/projects/:update?', HarvestEndpoints.harvestProjects)
expressAPI.get('/harvest/timesheets/:projectid/:start/:end/:update?', HarvestEndpoints.harvestTimesheets)

expressAPI.get('/asana/projects/find/:name(\\w+)', MapperEndpoints.findAsanaProjectsByName)
expressAPI.get('/asana/projects/find/:id(\\d+)', MapperEndpoints.findAsanaProjectsById)
expressAPI.get('/asana/projects/map/:name/:save?', MapperEndpoints.mapAsanaProjectsByName)

expressAPI.get('/asana/projects/:update?', AsanaEndpoints.asanaProjects)
expressAPI.get('/asana/tasks/get/', AsanaEndpoints.getAsanaProjectTasks)
expressAPI.get('/asana/tasks/get/filtered', AsanaEndpoints.getAsanaProjectTasksFiltered)
expressAPI.get('/asana/tasks/get/timesheets/date/:date/:asanaProjectId(\\d+)/:filtered?/:save?', AsanaEndpoints.getAsanaTimesheetsForDate)
expressAPI.get('/asana/tasks/get/timesheets/:asanaProjectId?', AsanaEndpoints.getAsanaTimesheetsForManifest)

expressAPI.get('/query/all/:asanaId', QueryEndpoints.queryAllFromAsanaId)

module.exports = function () {
  return expressAPI
}
