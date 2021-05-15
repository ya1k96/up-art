const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');
// Create Schema
var articuloSchema = new mongoose.Schema({
    codigo: {
      type: String,
      unique: true
    },
    fecha: {
      type: String,    
    },
    hecho: {
      type: Boolean,
      default: true
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
    descripcion: {
      type: String
    },
    actualizado: {
      type: Boolean,
      default: false
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'category'
    }
  });
  articuloSchema.plugin(mongoosePaginate);
  
  module.exports = mongoose.model('articulos', articuloSchema);