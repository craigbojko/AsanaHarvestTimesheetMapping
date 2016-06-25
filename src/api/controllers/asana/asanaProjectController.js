/**
* @Author: craigbojko
* @Date:   2016-04-05T17:46:03+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-24T11:47:17+01:00
*/

var Asana = require('asana')
var Promise = require('promise')
var asana
var AsanaProjectsModel = require('../../mongo').asanaProjects

var projectsPersisted = 0
var projectsUpdated = 0

module.exports = {
  getAsanaProjectList: getAsanaProjectList,
  persistAsanaProjects: persistAsanaProjects
}

function __normalise (name) {
  return name.toString().replace(/[^A-z0-9]/g, '').toLowerCase()
}

function getAsanaProjectList (cb) {
  asana = authoriseAsana()

  // var url = '#'
  // TODO - set ids in config file
  asana.projects.findAll({
    workspace: 896401739841,
    team: 2525101826384
  }, {}).then(function (collection) {
    collection.fetch(1000).then(function (projects) {
      cb(projects)
    })
  }, function (err) {
    if (err) {
      console.error(err)
    }
  })
}

function authoriseAsana () {
  return Asana.Client.create().useBasicAuth('3lK6MYFb.IP1FVS4J2qHlkN6QMgDPDLE') // TODO -- config this!!
}

function persistAsanaProjects (projects, cb) {
  var promiseArr = []

  for (var i = 0; i < projects.length; i++) {
    console.log('ASANA PROJECT: %s', projects[i])
    promiseArr.push(threadAsanaProjectPersistence(projects[i]))
  }

  Promise.all(promiseArr).then(function (counts) {
    console.log('ALL PROMISES COMPLETED: RUNNING CALLBACK')
    cb({
      counts: counts[counts.length - 1]
    })
  }, function (error) {
    console.error(error)
  })
}

function threadAsanaProjectPersistence (project) {
  return new Promise(function (resolve, reject) {
    AsanaProjectsModel.findOne({
      $or: [
        {
          'id': project.id
        }
      ]
    }).exec(function (err, doc) {
      if (err) {
        reject(err)
      } else {
        // persistAsanaProject(doc, project)
        if (doc) { // update
          console.log('FOUND ASANA PROJECT: %s', doc.id)
          updateAsanaProject(doc, project, resolve, reject)
        } else { // save new
          console.log('SAVING ASANA PROJECT: %s', project.id)
          insertAsanaProject(project, resolve, reject)
        }
      }
    })
  })
}

function updateAsanaProject (projectDoc, project, resolve, reject) {
  projectDoc.id = project.id
  projectDoc.name = project.name
  projectDoc.nameNormal = __normalise(project.name)
  projectDoc.save(function () {
    projectsUpdated++
    resolve({
      projectsUpdated: projectsUpdated,
      projectsPersisted: projectsPersisted
    })
  })
}

function insertAsanaProject (project, resolve, reject) {
  AsanaProjectsModel.create({
    id: project.id,
    name: project.name,
    nameNormal: __normalise(project.name)
  }, function (err) {
    if (err) {
      console.error('ERROR IN PERSISTING ASANA PROJECT: %s :: ', project.id, err)
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
