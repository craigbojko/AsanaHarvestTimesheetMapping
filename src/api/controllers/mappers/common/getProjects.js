/**
* @Author: craigbojko
* @Date:   2016-06-25T19:33:00+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-25T19:35:48+01:00
*/

var Promise = require('promise')

var AsanaProjectsModel = require('../../../mongo').asanaProjects
var HarvestProjectsModel = require('../../../mongo').harvestProjects
var __normalise = require('./normalise')

module.exports = {
  getAsanaProjectById: getAsanaProjectById,
  getAsanaProjectByName: getAsanaProjectByName,
  getHarvestProjectById: getHarvestProjectById,
  getHarvestProjectByName: getHarvestProjectByName,
  getAllHarvestProjects: getAllHarvestProjects,
  getAllAsanaProjects: getAllAsanaProjects
}

function getHarvestProjectByName (name) {
  return new Promise(function (resolve, reject) {
    HarvestProjectsModel.find({
      $or: [
        {
          'nameNormal': new RegExp('^' + __normalise(name), 'i')
        }
      ]
    }).exec(function (err, doc) {
      if (err) {
        reject(err)
      } else {
        if (doc) {
          resolve(doc)
        } else {
          reject(null)
        }
      }
    })
  })
}

function getAsanaProjectByName (name) {
  return new Promise(function (resolve, reject) {
    AsanaProjectsModel.find({
      $or: [
        {
          'nameNormal': new RegExp('^' + __normalise(name), 'i')
        }
      ]
    }).exec(function (err, doc) {
      if (err) {
        reject(err)
      } else {
        if (doc) {
          resolve(doc)
        } else {
          reject(null)
        }
      }
    })
  })
}

function getAsanaProjectById (id) {
  return new Promise(function (resolve, reject) {
    AsanaProjectsModel.findOne({
      'id': id
    }).exec(function (err, doc) {
      if (err) {
        reject(err)
      } else {
        if (doc) {
          resolve(doc)
        } else {
          reject({})
        }
      }
    })
  })
}

function getHarvestProjectById (id) {
  return new Promise(function (resolve, reject) {
    HarvestProjectsModel.findOne({
      'harvest_id': id
    }).exec(function (err, doc) {
      if (err) {
        reject(err)
      } else {
        if (doc) {
          resolve(doc)
        } else {
          reject({})
        }
      }
    })
  })
}

function getAllHarvestProjects () {
  return new Promise(function (resolve, reject) {
    HarvestProjectsModel.find({}).exec(function (err, doc) {
      if (err) {
        reject(err)
      } else {
        if (doc) {
          resolve(doc)
        } else {
          reject({})
        }
      }
    })
  })
}

function getAllAsanaProjects () {
  return new Promise(function (resolve, reject) {
    AsanaProjectsModel.find({}).exec(function (err, doc) {
      if (err) {
        reject(err)
      } else {
        if (doc) {
          resolve(doc)
        } else {
          reject({})
        }
      }
    })
  })
}
