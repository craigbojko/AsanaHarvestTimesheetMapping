/**
* @Author: craigbojko
* @Date:   2016-04-03T02:24:09+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-23T11:46:13+01:00
*/

module.exports = function (mongoose) {
  var Schema = mongoose.Schema
  var ObjectId = Schema.ObjectId

  var harvestSchema = new Schema({
    id: ObjectId,
    timesheetId: Number,
    harvestId: Number,
    client: String,
    type: String,
    notes: String,
    time: String,
    date: Date
  })

  return mongoose.model('harvest_timesheets', harvestSchema)
}
