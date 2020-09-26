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
    total: String,
    subTotalNormal: String,
    subTotalEspecial: String,
  },{ timestamps: true });

  module.exports = mongoose.model('liquidacion', liquidacionSchema);