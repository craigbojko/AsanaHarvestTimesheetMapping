/**
* @Author: craigbojko
* @Date:   2016-04-11T14:51:23+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-04-11T14:51:30+01:00
*/

module.exports = function (mongoose) {
  var Schema = mongoose.Schema
  // var ObjectId = Schema.ObjectId

  var asanaSchema = new Schema({
    id: Number,
    name: String
  })

  return mongoose.model('asana_projects', asanaSchema)
}
