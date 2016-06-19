/**
* @Author: craigbojko
* @Date:   2016-04-20T22:40:39+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-19T19:13:07+01:00
*/

// var Harvest = require('harvest')
var HarvestUserController = require('../controllers/harvest/harvestUserController')
var HarvestProjectController = require('../controllers/harvest/harvestProjectController')
var HarvestTimesheetController = require('../controllers/harvest/harvestTimesheetController')

module.exports = {
  harvest: harvest,
  harvestUsers: harvestUsers,
  harvestProjects: harvestProjects,
  harvestTimesheets: harvestTimesheets
}

function harvest (req, res, next) {
  res.json({

  })
}

function harvestUsers (req, res, next) {
  HarvestUserController.getHarvestUserList(function (resp) {
    res.json(resp)
    if (req.params.update && req.params.update === 'update') {
      console.log('PERSISTING USER INFO TO MONGO DB')
      HarvestUserController.persistHarvestUserList(resp.data.data, function (nums) {
        console.log('PERSISTING COMPLETE: HARVEST USER INFO.')
        console.log(nums)
      })
    }
  })
}

function harvestProjects (req, res, next) {
  HarvestProjectController.getHarvestProjectList(function (resp) {
    res.json(resp)
    if (req.params.update && req.params.update === 'update') {
      console.log('PERSISTING PROJECT INFO TO MONGO DB')
      HarvestProjectController.persistHarvestProjectList(resp.data.data, function (nums) {
        console.log('PERSISTING COMPLETE: HARVEST PROJECT INFO.')
        console.log(nums)
      })
    }
  })
}

function harvestTimesheets (req, res, next) {
  var params = req.params

  if (!params.projectid || !params.start || !params.end) {
    res.json({
      error: 'Parameters missing from request',
      projectid: params.projectid,
      start: params.start,
      end: params.end
    })
  }

  HarvestTimesheetController.getHarvestTimesheetList(params.projectid, params.start, params.end, function (resp) {
    res.json(resp)
  // if (req.params.update && req.params.update === 'update') {
  //   console.log('PERSISTING PROJECT INFO TO MONGO DB')
  //   api.persistHarvestProjectList(collections.harvestProjects, resp.data.data, function (nums) {
  //     console.log('PERSISTING COMPLETE: HARVEST PROJECT INFO.')
  //     console.log(nums)
  //   })
  // }
  })
}
