/**
* @Author: craigbojko
* @Date:   2016-03-21T00:02:40+00:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-04-12T10:15:58+01:00
*/

module.exports = function (mongoose) {
  var Schema = mongoose.Schema
  var ObjectId = Schema.ObjectId

  var mapsSchema = new Schema({
    mapId: ObjectId,
    asanaId: String,
    harvestId: String,
    clientId: String,
    name: String
  })

  return mongoose.model('map_project_ids', mapsSchema)
}
