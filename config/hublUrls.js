/**
* @Author: craigbojko
* @Date:   2016-03-22T22:51:36+00:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-05-13T16:49:28+01:00
*/

module.exports = {
  harvest: {
    endpoints: 'https://hubl.qubitproducts.com/v1/harvest/v1',
    users: 'https://hubl.qubitproducts.com/v1/harvest/v1/users',
    projects: 'https://hubl.qubitproducts.com/v1/harvest/v1/projects',
    timesheet: 'https://hubl.qubitproducts.com/v1/harvest/v1/timesheet/spent/{{projectid}}/{{datestart}}/{{dateend}}' // https://hubl.qubitproducts.com/v1/harvest/v1/timesheet/3892338/2016-03-01T00:00:00Z/2016-03-21T00:00:00Z
  }
}
