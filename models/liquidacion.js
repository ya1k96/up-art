const mongoose = require('mongoose')
// Create Schema
var liquidacionSchema = new mongoose.Schema({
    articulos: [
      {
        type: mongoose.Schema.ObjectId, ref:"articulos"
      }
    ],
    pagado: {
      type: Boolean,
      default: false
    },    
    //TODO: Agregar Modelo de detalle
    total: String,
    subTotalNormal: String,
    subTotalEspecial: String,
    cantNormal: Number,
    cantEspecial: Number,
    precioEspecial: Number,
    precioNormal: Number
  },{ timestamps: true });

  module.exports = mongoose.model('liquidacion', liquidacionSchema);