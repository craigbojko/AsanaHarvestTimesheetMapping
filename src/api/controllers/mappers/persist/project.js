/**
* @Author: craigbojko
* @Date:   2016-06-25T19:43:29+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-25T19:46:25+01:00
*/

var Promise = require('promise')

var MapProjectModel = require('../../mongo').mapProjectIds

var projectsPersisted = 0
var projectsUpdated = 0

module.exports = {
  persistProjectIdMapping: persistProjectIdMapping
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
          console.log('FOUND PROJECT MAPPING: %s', doc.asanaId)
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
