const mongoose = require('mongoose')

const Schema = mongoose.Schema

let AgendaSchema = new Schema
    ({
        usuario: { type: Schema.Types.ObjectId, ref: 'user' },
        title: String,
        start: String,
        end: String 
    })


let AgendaModel = mongoose.model('Evento', AgendaSchema)

module.exports = AgendaModel