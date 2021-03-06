const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');
// Create Schema
var articuloSchema = new mongoose.Schema({
    codigo: {
      type: String,
      unique: true
    },
    imagen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'imagenes'
    },
    fecha: {
      type: String,    
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
    }
  });
  articuloSchema.plugin(mongoosePaginate);
  
  module.exports = mongoose.model('articulos', articuloSchema);