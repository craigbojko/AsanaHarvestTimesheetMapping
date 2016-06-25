/**
* @Author: craigbojko
* @Date:   2016-03-21T00:02:40+00:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-23T11:45:55+01:00
*/

module.exports = function (mongoose) {
  var Schema = mongoose.Schema
  var ObjectId = Schema.ObjectId

  var mapsSchema = new Schema({
    id: ObjectId,
    mapId: ObjectId,
    asanaId: String,
    timesheetId: Number,
    notes: String,
    spent_at: String,
    hours: Number,
    user_id: Number,
    project_id: Number,
    task_id: Number,
    created_at: Date,
    updated_at: Date,
    user_department: String,
    task_type: String
  })

  return mongoose.model('map_timesheets', mapsSchema)
}
