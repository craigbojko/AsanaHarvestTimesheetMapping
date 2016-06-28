/**
* @Author: craigbojko
* @Date:   2016-06-23T15:05:25+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-25T20:24:51+01:00
*/

var Promise = require('promise')

var CommonProjectFunctions = require('./common/getProjects')

module.exports = {
  createJSONProjectIdConfig: mapByProjectIds
}

function mapByProjectIds () {
  var harvestPromise = new Promise(function (resolve, reject) {
    CommonProjectFunctions.getAllHarvestProjects().then(function (resp) {
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
    harvestPromise.then(function (data) {
      console.log('AUTO MAPPING PROMISE:')
      console.log('HARVEST PROJECTS FOUND: ', data[0].length)
      var promiseArr = []

      for (var i = 0; i < data.length; i++) {
        var harvestObj = data[i].toObject()
        promiseArr.push(threadProjectMap(harvestObj))
      }

      Promise.all(promiseArr.map(function (map) { // settle if reject
        return map.catch(function (err) {
          console.log('ERROR HANDLED IN PROMISE.ALL: ', err)
          return err
        })
      })).then(function (data) {
        var count = 0
        for (var j = 0; j < data.length; j++) {
          if (data[j] && data[j].harvest && data[j].asana && data[j].asana.length) {
            count++
          }
        }

        console.log('AUTO MAPPING LENGTH: ', data.length)
        console.log('AUTO MAPPING SUCCESS: ', count)
        console.log('AUTO MAPPING STRIKE: ', (count / data.length) * 100)
        resolve(data)
      }, function (err) {
        console.log(err)
        reject(err)
      })
    }, function (err) {
      console.log('ERROR: ', err)
      reject({
        error: err
      })
    })
  })
}

function threadProjectMap (harvestProject) {
  return new Promise(function (resolve, reject) {
    CommonProjectFunctions.getAsanaProjectByName(harvestProject.name).then(function (asanaProjects) {
      resolve({
        harvest: harvestProject,
        asana: asanaProjects
      })
    }, function (err) {
      console.log('ERROR: ', err)
      reject(err)
    })
  })
}
