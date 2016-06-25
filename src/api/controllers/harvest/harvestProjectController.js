/**
* @Author: craigbojko
* @Date:   2016-04-03T02:06:44+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-24T11:38:58+01:00
*/

var axios = require('axios')
var hublUrls = require('config/hublUrls')
var Promise = require('promise')

var HarvestProjectModel = require('../../mongo').harvestProjects

var projectsPersisted = 0
var projectsUpdated = 0

module.exports = {
  getHarvestProjectList: getHarvestProjectList,
  persistHarvestProjectList: persistHarvestProjectList
}

function getHarvestProjectList (cb) {
  axios.get(hublUrls.harvest.projects)
    .then(function (response) {
      cb(response)
    })
    .catch(function (response) {
      cb(response)
    })
}

function persistHarvestProjectList (data, cb) {
  var promiseArr = []

  for (var i = 0; i < data.length; i++) {
    console.log('HARVEST PROJECT: %s', data[i].id)
    promiseArr.push(threadHarvestProjectPersistence(data[i]))
  }

  Promise.all(promiseArr).then(function (counts) {
    console.log('ALL PROMISES COMPLETED: RUNNING CALLBACK')
    cb({
      // updated: counts.projectsUpdated,
      // persisted: counts.projectsPersisted
      counts: counts[counts.length - 1]
    })
  }, function (error) {
    console.error(error)
  })
}

function threadHarvestProjectPersistence (harvestProject) {
  return new Promise(function (resolve, reject) {
    HarvestProjectModel.findOne({
      $or: [
        {
          'harvest_id': harvestProject.id
        }
      ]
    }).exec(function (err, doc) {
      if (err) {
        reject(err)
      } else {
        // persistHarvestProject(doc, harvestProject)
        if (doc) { // update
          console.log('FOUND HARVEST PROJECT: %s', doc.id)
          updateHarvestProject(doc, harvestProject, resolve, reject)
        } else { // save new
          console.log('SAVING HARVEST PROJECT: %s', harvestProject.id)
          insertHarvestProject(harvestProject, resolve, reject)
        }
      }
    })
  })
}

function updateHarvestProject (projectDoc, harvestProject, resolve, reject) {
  projectDoc.harvest_id = harvestProject.id
  projectDoc.client_id = harvestProject.client_id
  projectDoc.name = harvestProject.name
  projectDoc.nameNormal = __normalise(harvestProject.name)
  projectDoc.created_at = harvestProject.created_at
  projectDoc.save(function () {
    projectsUpdated++
    resolve({
      projectsUpdated: projectsUpdated,
      projectsPersisted: projectsPersisted
    })
  })
}

function insertHarvestProject (harvestProject, resolve, reject) {
  HarvestProjectModel.create({
    harvest_id: harvestProject.id,
    client_id: harvestProject.client_id,
    name: harvestProject.name,
    nameNormal: __normalise(harvestProject.name),
    created_at: harvestProject.created_at
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

function __normalise (name) {
  return name.toString().replace(/[^A-z0-9]/g, '').toLowerCase()
}
