module.exports = function (mongoose) {
  var Schema = mongoose.Schema
  var ObjectId = Schema.ObjectId

  var harvestSchema = new Schema({
    objId: ObjectId,
    id: Number,
    email: String,
    created_at: Date,
    is_admin: Boolean,
    first_name: String,
    last_name: String,
    telephone: String,
    is_active: Boolean,
    department: String,
    updated_at: Date
  })

  return mongoose.model('harvest_users', harvestSchema)
}
