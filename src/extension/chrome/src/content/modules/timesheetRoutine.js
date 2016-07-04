/**
* @Author: craigbojko
* @Date:   2016-07-04T14:23:17+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-07-04T16:03:52+01:00
*/

var axios = require('axios')
var Promise = require('promise')
var limit = require('simple-rate-limiter')
// var Request = require('request')

module.exports = {
  queueTimesheetsForTaskIds: queueRequestsToApi,
  getTimesheetForTaskId: requestFromApi
}

function queueRequestsToApi (taskIdArr, chunkCb) {
  var request = limit(requestFromApi).to(10).per(1000)

  taskIdArr.forEach(function (taskId) {
    request(taskId, chunkCb, chunkCb).on('data', function (chunk) {
      chunkCb(chunk)
    })
  })
}

function requestFromApi (asanaTaskId, cbSuccess, csFail) {
  var url = generateUrl(asanaTaskId)

  console.log('URL BEING REQUESTED: ', url)
  // console.log('POST DATA: ', JSON.stringify(body))

  axios.get(url).then(function (response) {
    if (response && response.status) {
      if (response.status !== 200) {
        console.log('ERROR: '.red + response.statusText)
        csFail(response)
      } else {
        cbSuccess(response)
      }
    } else {
      csFail(response)
    }
  }).catch(function (error) {
    csFail(error)
  })
}

function generateUrl (asanaTaskId) {
  return 'https://localhost:5101/api/query/all/' + 0 + '/' + asanaTaskId
}
