const mongoose = require('mongoose')

const Schema = mongoose.Schema

let UserSchema = new Schema({
  usuario: String,
  contrasena: String,
  eventos: [{ type: Schema.Types.ObjectId, ref: 'event' }]
});


let UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel;


