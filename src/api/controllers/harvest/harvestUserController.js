/**
* @Author: craigbojko
* @Date:   2016-04-03T00:53:45+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-19T19:11:26+01:00
*/

var axios = require('axios')
var hublUrls = require('config/hublUrls')
var Promise = require('promise')

var HarvestUserModel = require('../../mongo').harvestUsers

var usersPersisted = 0
var usersUpdated = 0

module.exports = {
  getHarvestUserList: getHarvestUserList,
  persistHarvestUserList: persistHarvestUserList
}

function getHarvestUserList (cb) {
  axios.get(hublUrls.harvest.users)
    .then(function (response) {
      cb(response)
    })
    .catch(function (response) {
      cb(response)
    })
}

function persistHarvestUserList (data, cb) {
  var promiseArr = []

  for (var i = 0; i < data.length; i++) {
    console.log('HARVEST USER: %s', data[i].id)
    promiseArr.push(threadHarvestUserPersistence(data[i]))
  }

  Promise.all(promiseArr).then(function (counts) {
    console.log('ALL PROMISES COMPLETED: RUNNING CALLBACK')
    cb({
      // updated: counts.usersUpdated,
      // persisted: counts.usersPersisted
      counts: counts[counts.length - 1]
    })
  }, function (error) {
    console.error(error)
  })
}

function threadHarvestUserPersistence (harvestUser) {
  return new Promise(function (resolve, reject) {
    HarvestUserModel.findOne({
      $or: [
        {
          'id': harvestUser.id
        },
        {
          'email': harvestUser.email
        }
      ]
    }).exec(function (err, doc) {
      if (err) {
        reject(err)
      } else {
        // persistHarvestUser(doc, harvestUser)
        if (doc) { // update
          console.log('FOUND HARVEST USER: %s', doc.id)
          updateHarvestUser(doc, harvestUser, resolve, reject)
        } else { // save new
          console.log('SAVING HARVEST USER: %s', harvestUser.id)
          insertHarvestUser(harvestUser, resolve, reject)
        }
      }
    })
  })
}

function updateHarvestUser (userDoc, harvestUser, resolve, reject) {
  userDoc.id = harvestUser.id
  userDoc.email = harvestUser.email
  userDoc.created_at = harvestUser.created_at
  userDoc.is_admin = harvestUser.is_admin
  userDoc.first_name = harvestUser.first_name
  userDoc.last_name = harvestUser.last_name
  userDoc.telephone = harvestUser.telephone
  userDoc.is_active = harvestUser.is_active
  userDoc.department = harvestUser.department
  userDoc.updated_at = harvestUser.updated_at
  userDoc.save(function () {
    usersUpdated++
    resolve({
      usersUpdated: usersUpdated,
      usersPersisted: usersPersisted
    })
  })
}

function insertHarvestUser (harvestUser, resolve, reject) {
  HarvestUserModel.create({
    id: harvestUser.id,
    email: harvestUser.email,
    created_at: harvestUser.created_at,
    is_admin: harvestUser.is_admin,
    first_name: harvestUser.first_name,
    last_name: harvestUser.last_name,
    telephone: harvestUser.telephone,
    is_active: harvestUser.is_active,
    department: harvestUser.department,
    updated_at: harvestUser.updated_at
  }, function (err) {
    if (err) {
      console.error('ERROR IN PERSISTING HARVEST USER: %s :: ', harvestUser.id, err)
      reject(err)
    } else {
      usersPersisted++
      resolve({
        usersUpdated: usersUpdated,
        usersPersisted: usersPersisted
      })
    }
  })
}
