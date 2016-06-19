/**
* @Author: craigbojko
* @Date:   2016-06-18T16:36:46+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-18T16:48:52+01:00
*/

var mongoose = require('mongoose')
var config = require('../../config/config')

mongoose.connect(config.db)

var models = {
  asana: require('./models/asana_tasks')(mongoose),
  asanaProjects: require('./models/asana_projects')(mongoose),
  // harvest: require('./models/harvest_entries')(mongoose),
  harvestUsers: require('./models/harvest_users')(mongoose),
  harvestProjects: require('./models/harvest_projects')(mongoose),
  harvestTimesheets: require('./models/harvest_timesheets')(mongoose),
  mapProjectIds: require('./models/map_projects')(mongoose),
  mapTimesheets: require('./models/map_timesheets')(mongoose)
}

module.exports = models
