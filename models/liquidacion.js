const mongoose = require('mongoose')
// Create Schema
var liquidacionSchema = new mongoose.Schema({
    liquidacionDetalle: [
      {
        type: mongoose.Schema.ObjectId, ref:"liquidacionDetalle"
      }
    ],
    pagado: {
      type: Boolean,
      default: null
    },
    total: String,
    articulos: [
      {
        type: mongoose.Schema.ObjectId, ref:"items"
      }
    ]
  },{ timestamps: true });

  module.exports = mongoose.model('liquidacion', liquidacionSchema);