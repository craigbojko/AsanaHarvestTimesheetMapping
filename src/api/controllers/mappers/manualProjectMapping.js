/**
* @Author: craigbojko
* @Date:   2016-06-23T15:05:25+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-25T20:02:26+01:00
*/

var axios = require('axios')
var Promise = require('promise')
var hublUrls = require('config/hublUrls')

var MapProjectModel = require('../../mongo').mapProjectIds
var MapTimesheetModel = require('../../mongo').mapTimesheets

var MapperHAProjects = require('./harvestAsanaProjects')
var CommonProjectFunctions = require('./common/getProjects')

module.exports = {
  mapManualProjectIds: mapByProjectIds
}

function mapByProjectIds (harvestId, asanaId) {
  var harvestPromise = new Promise(function (resolve, reject) {
    CommonProjectFunctions.getHarvestProjectById(harvestId).then(function (resp) {
      if (!resp) {
        reject(resp)
      } else {
        resolve(resp)
      }
    }, function (err) {
      resolve(err) // resolve empty
    })
  })

  var asanaPromise = new Promise(function (resolve, reject) {
    CommonProjectFunctions.getAsanaProjectById(asanaId).then(function (resp) {
      if (!resp) {
        reject(resp)
      } else {
        resolve(resp)
      }
    }, function (err) {
      resolve(err) // resolve empty
    })
  })

  return new Promise(function (resolve, reject) {
    Promise.all([harvestPromise, asanaPromise]).then(function (data) {
      console.log('MANUAL MAPPING PROMISE DATA::')
      console.log(data)
      var harvestDoc = data[0] && data[0].toObject()
      var asanaDoc = data[1] && data[1].toObject()

      if (harvestDoc && asanaDoc && (asanaDoc.length || asanaDoc.hasOwnProperty('name'))) {
        var mapProjectPromises = []

        if (asanaDoc.hasOwnProperty('name')) { // only 1
          var projectData = [harvestDoc, asanaDoc]
          console.log('PERSISTING ASANA PROJECT ID: ', asanaDoc.id)
          mapProjectPromises.push(MapperHAProjects.persistProjectIdMapping(projectData))
        } else {
          for (var i = 0; i < data[1].length; i++) {
            var projectData_2 = [harvestDoc, asanaDoc[i]]
            console.log('PERSISTING ASANA PROJECT ID: ', asanaDoc[i].id)
            mapProjectPromises.push(MapperHAProjects.persistProjectIdMapping(projectData_2))
          }
        }
        Promise.all(mapProjectPromises).then(function resolveMapPromise (saveData) {
          console.log('RESOLVING MANUAL')
          resolve(saveData)
        }, function rejectMapPromise (err) {
          console.log('ERROR: REJECTING MANUAL:: ', err)
          reject(err)
        })
      } else {
        reject({
          error: 'Not enough mapping data found',
          data: data
        })
      }
    }, function (err) {
      console.log('ERROR: ', err)
      reject({
        error: err
      })
    })
  })
}
