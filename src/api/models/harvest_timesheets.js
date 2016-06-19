module.exports = function (mongoose) {
  var Schema = mongoose.Schema
  var ObjectId = Schema.ObjectId

  var harvestSchema = new Schema({
    id: ObjectId,
    harvestId: Number,
    client: String,
    type: String,
    notes: String,
    time: String,
    date: Date
  })

  return mongoose.model('harvest_timesheets', harvestSchema)
}
