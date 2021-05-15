const mongoose = require('mongoose')
// Create Schema
//Este modelo esta pensado como documento intermedio. De forma de mantener la consistencia de los objetos
var observacionSchema = new mongoose.Schema({
    img_muestra: {
        type: mongoose.Schema.ObjectId,
        ref: 'imagenes',
        default: 'null'
    },
    comentario: {
        type: String,
        required: true
    },
    autor: {
        type: String,
        default: 'ANONIMO'
    },
    visto: {
        tye: Boolean,
        default: false
    }
  }, {timestamps: true});
  
  module.exports = mongoose.model('observacion', observacionSchema);