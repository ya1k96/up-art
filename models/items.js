const mongoose = require('mongoose')
// Create Schema
var articuloSchema = new mongoose.Schema({
    codigo: String,
    fecha: {
      type: [String],    
    },
    tipoArticulo: {
      type: String,
      enum: ["Normal", "Especial"],
      default:"Normal"
    },
    liquidado : {
      type: Boolean, 
      default: false
    },
    observacion: {
      type: String
    }
  });

  module.exports = mongoose.model('articulos', articuloSchema);