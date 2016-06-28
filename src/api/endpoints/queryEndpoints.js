/**
* @Author: craigbojko
* @Date:   2016-05-16T09:58:00+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-26T02:43:15+01:00
*/

var QueryController = require('../controllers/queries/queryController')

module.exports = {
  queryAllFromAsanaId: queryAllFromAsanaId
}

function queryAllFromAsanaId (req, res) {
  var asanaId = req.params.asanaId
  var taskId = req.params.taskId
  if (!asanaId) {
    res.status(404)
    res.send({
      error: 'no asanaId found'
    })
    return
  }

  QueryController.getAllTimesheetsByAsanaId(asanaId, taskId, function (resp) {
    if (resp) {
      console.log('TIMESHEETS FOUND: #', resp.length)
      res.status(200)
      res.send(resp)
    } else {
      res.status(500)
      res.send({
        error: 'no response',
        resp: resp
      })
    }
  })
}
