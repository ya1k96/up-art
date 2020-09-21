const mongoose = require('mongoose')
// Create Schema
var articuloSchema = new mongoose.Schema({
    codigo: {
      type: String,
      unique: true
    },
    fecha: {
      type: String,    
    },
    //tipoArticulo: {
    //  type: String,
    //  enum: ["Normal", "Especial"],
    //  default:"Normal"
    //},
    liquidado : {
      type: Boolean, 
      default: false
    },
    observacion: {
      type: String
    },
    actualizado: {
      type: Boolean,
      default: false
    }
  });

  module.exports = mongoose.model('articulos', articuloSchema);