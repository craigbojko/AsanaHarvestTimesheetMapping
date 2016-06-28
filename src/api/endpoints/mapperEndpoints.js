/**
* @Author: craigbojko
* @Date:   2016-04-20T22:40:09+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-25T20:25:47+01:00
*/

var Promise = require('promise')
var MapperHAProjects = require('../controllers/mappers/harvestAsanaProjects')
var ManualMapperHAProjects = require('../controllers/mappers/manualProjectMapping')
var AutoMapperHAProjects = require('../controllers/mappers/autoProjectMapping')

var CommonProjectFunctions = require('../controllers/mappers/common/getProjects')

module.exports = {
  findAsanaProjectsByName: findAsanaProjectsByName,
  findAsanaProjectsById: findAsanaProjectsById,
  mapAsanaProjectsByName: mapAsanaProjectsByName,
  mapAsanaProjectsById: mapProjectsByIdManual,
  autoMapHAProjects: mapProjectsByIdAuto
}

function mapProjectsByIdManual (req, res) {
  ManualMapperHAProjects.mapManualProjectIds(req.params.harvestId, req.params.asanaId).then(function (resp) {
    res.send(resp)
  }, function (err) {
    console.log('ERROR: ', err)
    res.send(err)
  })
}

function mapProjectsByIdAuto (req, res) {
  // Build config to validate - used later for matching within manual functions
  AutoMapperHAProjects.createJSONProjectIdConfig().then(function (resp) {
    res.send(resp)
  }, function (err) {
    console.log('ERROR: ', err)
    res.send(err)
  })
}

function findAsanaProjectsByName (req, res, next) {
  if (!isNaN(req.params.name)) {
    next()
    return
  }

  CommonProjectFunctions.getAsanaProjectByName(req.params.name).then(function (resp) {
    if (!resp) {
      res.status(404)
      res.send({ error: 'Not found' })
    } else {
      res.status(200)
      res.send(resp)
      console.log('PROJECT FOUND: ', resp)
    }
  })
}

function findAsanaProjectsById (req, res, next) {
  CommonProjectFunctions.getAsanaProjectById(req.params.id).then(function (resp) {
    if (!resp) {
      res.status(404)
      res.send({ error: 'Not found' })
    } else {
      res.status(200)
      res.send(resp)
      console.log('PROJECT FOUND: ', resp)
    }
  })
}

function mapAsanaProjectsByName (req, res, next) {
  var harvestPromise = function () {
    return new Promise(function (resolve, reject) {
      CommonProjectFunctions.getHarvestProjectByName(req.params.name).then(function (resp) {
        if (!resp) {
          reject(resp)
        } else {
          resolve(resp)
        }
      })
    })
  }

  var asanaPromise = function () {
    return new Promise(function (resolve, reject) {
      CommonProjectFunctions.getAsanaProjectByName(req.params.name).then(function (resp) {
        if (!resp) {
          reject(resp)
        } else {
          resolve(resp)
        }
      })
    })
  }

  Promise.all([harvestPromise(), asanaPromise()]).then(function (data) {
    console.log(data)
    if (req.params.save && req.params.save === 'save' && data[1].length) {
      var asanaProjectPromises = []
      for (var i = 0; i < data[1].length; i++) {
        var projectData = [data[0][0], data[1][i]]
        console.log('PERSISTING ASANA PROJECT ID: ', data[1][i])
        asanaProjectPromises.push(MapperHAProjects.persistProjectIdMapping(projectData))

        Promise.all(asanaProjectPromises).then(function (saveData) { // TODO - this really shouldnt be in a loop
          // will only respond with the first mapping
          res.json(saveData)
        }, function (err) {
          console.error(err)
        })
      }
    } else if (data[1].length) {
      res.json(data)
    } else {
      res.json({
        error: 'No mapping data found',
        data: data
      })
    }
  }, function (err) {
    res.status(500)
    res.send({error: err})
  })
}
