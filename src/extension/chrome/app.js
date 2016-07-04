/**
* @Author: craigbojko
* @Date:   2016-04-04T13:10:03+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-07-04T16:18:05+01:00
*/

require('!style!css!less!./src/content/styles/main.less')
var $ = require('jquery')
var timesheetRoutine = require('./src/content/modules/timesheetRoutine')

init()
module.exports = init

function init () {
  console.log('INIT')

  $(document).ready(function () {
    pollForDom(runApp)
  })
}

function pollForDom (cb, time) {
  if ($('tr.task-row').length > 1) {
    $(cb)
  } else {
    setTimeout(function () {
      pollForDom(cb, time * 1.5)
    }, time)
  }
}

function runApp () {
  console.log('RUN')
  var $rows = $('tr.task-row')
  var ids = getTaskIds($rows)

  timesheetRoutine.queueTimesheetsForTaskIds(ids, querySuccess, queryFail)
}

function querySuccess (chunkData) {
  console.log('QUERY SUCCESS: CHUNK DATA:: ')
  console.log(chunkData)
  injectDivs(chunkData)
}

function queryFail (chunkData) {
  console.log('ERROR: QUERY FAIL: ')
  console.log(chunkData)
}

function getTaskIds ($rows) {
  var $ = require('jquery')
  var ids = []

  $rows.each(function () {
    var id = -1
    try {
      id = parseInt($(this).attr('id').replace('item_row_view_', ''), 10)
      ids.push(id)
    } catch (e) {
      console.error('ERROR: ', e.msg)
    }
  })
  return ids
}

function injectDivs (queryData) {
  var $rows = $('tr.task-row')
  var $divTemplate = $('<div class="qubitATQ_main"></div>')
  var $parent = $rows.eq(0).parent()
  var id = queryData && queryData.data && queryData.data[0] && queryData.data[0].asanaId

  if (id && id !== '') {
    var totalTime = 0
    var $div = $divTemplate.clone()

    queryData.data.forEach(function (chunk) {
      totalTime += chunk.hours
    })

    $div
      .data('id', id)
      .html('<span><b>ID:: </b>' + id + ' -- Total Time: ' + totalTime + '</span>')
      .appendTo($parent.find('#item_row_view_' + id + ' td.grid_cell_string'))
  }
}
