/**
* @Author: craigbojko
* @Date:   2016-03-27T21:58:26+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-24T11:32:22+01:00
*/

module.exports = function (mongoose) {
  var Schema = mongoose.Schema
  var ObjectId = Schema.ObjectId

  var harvestSchema = new Schema({
    id: ObjectId,
    harvest_id: Number,
    client_id: Number,
    name: String,
    nameNormal: String,
    created_at: Date
  })

  return mongoose.model('harvest_projects', harvestSchema)
}
