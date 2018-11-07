const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let UserSchema = new Schema({
    usuario: String,
    contrasena: String,
    eventos: [{ type: Schema.Types.ObjectId, ref: 'event' }]
});

let AgendaSchema = new Schema
    ({
        id: { type: Schema.Types.ObjectId, ref: 'user' },
        title: String,
        start: String,
        end: String 
    })

    let UserModel = mongoose.model('user', UserSchema)

    let AgendaModel = mongoose.model('evento', AgendaSchema)

module.exports = {
    UserModel,
    AgendaModel
}
