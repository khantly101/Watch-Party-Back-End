const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  userName: { type:String, require:true, unique: true},
  password: { type: String, require:true },
  firstName: { type: String, require: true},
  lastName: { type: String, require: true},
  img: String,
  info: String,
  partyrooms: []
})

const User = mongoose.model('User', userSchema)
module.exports = User
