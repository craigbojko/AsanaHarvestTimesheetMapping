module.exports = function (mongoose) {
  var Schema = mongoose.Schema
  var ObjectId = Schema.ObjectId

  var asanaSchema = new Schema({
    asanaId: ObjectId,
    name: String,
    project: String,
    date: Date,
    memberships: Object
  })

  return mongoose.model('asana_tasks', asanaSchema)
}
