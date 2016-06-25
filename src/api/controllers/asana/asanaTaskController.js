/**
* @Author: craigbojko
* @Date:   2016-04-18T16:18:53+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-21T17:03:18+01:00
*/

var Asana = require('asana')
var Promise = require('promise')
var asana

module.exports = {
  getAsanaProjectManifest: getAsanaProjectManifest,
  getAsanaProjectManifestWithDetails: getAsanaProjectManifestWithDetails,
  getAsanaTasksWithProjectId: getAsanaTasksWithProjectId
}

function getAsanaTasksWithProjectId () {
  asana = authoriseAsana()
  // var url = '#'
  // TODO - set ids in config file

  return new Promise(function (resolve, reject) {
    asana.tasks.findByProject('32972561372564', {
      workspace: '896401739841',
      opt_fields: 'id,name,current_status,projects.id,projects.name'
    }).then(function (collection) {
      collection.fetch(10).then(function (tasks) { // TODO up to 1000
        var parsedTasks = []
        for (var i = 0; i < tasks.length; i++) {
          var task = tasks[i]
          var _task = {}
          var url = 'https://app.asana.com/0/32972561372564/' + task.id

          _task.id = task.id
          _task.name = task.name
          _task.url = url
          if (task.projects && task.projects.length) {
            for (var j = 0; j < task.projects.length; j++) {
              var projectId = task.projects[j].id
              if (parseInt(projectId, 10) !== 32972561372564) {
                _task.projectId = projectId
              }
            }
          }

          if (_task && _task.name && _task.projectId) {
            parsedTasks.push(_task)
          }
        }

        resolve(parsedTasks)
      })
    }, function (err) {
      if (err) {
        console.error(err)
        reject(err)
      }
    })
  })
}

function getAsanaProjectManifest () {
  asana = authoriseAsana()
  // var url = '#'
  // TODO - set ids in config file

  return new Promise(function (resolve, reject) {
    asana.tasks.findByProject('32972561372564', {
      workspace: '896401739841',
      opt_fields: 'name,projects.id,projects.name'
    }).then(function (collection) {
      collection.fetch(1000).then(function (tasks) {
        resolve(tasks)
      })
    }, function (err) {
      if (err) {
        console.error(err)
        reject(err)
      }
    })
  })
}

function getAsanaProjectManifestWithDetails () {
  asana = authoriseAsana()
  // var url = '#'
  // TODO - set ids in config file

  return new Promise(function (resolve, reject) {
    asana.tasks.findByProject('32972561372564', {
      workspace: '896401739841',
      opt_fields: 'name,assignee.photo,followers.id,followers.name,followers.email,assignee.id,assignee.name,assignee.email,tags.id,tags.name,projects.id,projects.name,due_on,memberships.section.id,memberships.section.name,memberships.project.id,memberships.project.name'
    }).then(function (collection) {
      collection.fetch(1000).then(function (tasks) {
        resolve(tasks)
      })
    }, function (err) {
      if (err) {
        console.error(err)
        reject(err)
      }
    })
  })
}

function authoriseAsana () {
  return Asana.Client.create().useBasicAuth('3lK6MYFb.IP1FVS4J2qHlkN6QMgDPDLE')
}
