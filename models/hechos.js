const mongoose = require('mongoose')
// Create Schema
//Este modelo esta pensado como documento intermedio. De forma de mantener la consistencia de los objetos
var hechosSchema = new mongoose.Schema({
    articulo: {
      type: mongoose.Schema.ObjectId,
      ref: 'articulos',
      required: true,
      unique: true
    },
    tipo_articulo: {
        type: mongoose.Schema.ObjectId,
        ref: 'tipo_articulos',
        required: true
    },
    imagen:{
        type: mongoose.Schema.ObjectId,
        ref: 'imagenes',
        default: null
    },
    aprobado: {
        type: Boolean,
        default: null
    },  
    liquidado: {
        type: Boolean,
        default: false
    },
    observaciones: [
        {
            type: mongoose.Schema.ObjectId, ref: "observacion"
        }
    ]
  }, {timestamps: true});
  
  module.exports = mongoose.model('hechos', hechosSchema);