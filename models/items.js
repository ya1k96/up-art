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
    },
    actualizado: {
      type: Boolean,
      default: false
    },
    aprobado: {
      type: Boolean,
      default: true
    },
    revisado: {
      type: Boolean,
      default: false
    },
    image: {
      type: Boolean,
      default: false
    },
    img_url: {
      type: String,
      default: 'https://res.cloudinary.com/jungoma/image/upload/v1601781044/ohih3abt3cbtwatzytyc.png'
    }
  });

  module.exports = mongoose.model('articulos', articuloSchema);