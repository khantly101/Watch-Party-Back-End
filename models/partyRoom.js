const mongoose = require('mongoose')
const Schema = mongoose.Schema

const partyRoomSchema = new Schema({
  roomName: { type: String, require: true},
  nameSpace: { type: String, require: true},
  creator: { type: String, require:true },
  upload: String,
  img: String,
  description: String,
  messages: [],
  clients:[]
})

const PartyRoom = mongoose.model('PartyRoom', partyRoomSchema)
module.exports = PartyRoom
