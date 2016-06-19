module.exports = function (mongoose) {
  var Schema = mongoose.Schema
  var ObjectId = Schema.ObjectId

  var harvestSchema = new Schema({
    id: ObjectId,
    harvest_id: Number,
    client_id: Number,
    name: String,
    created_at: Date
  })

  return mongoose.model('harvest_projects', harvestSchema)
}
