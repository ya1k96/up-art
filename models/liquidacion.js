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
    total: String
  },{ timestamps: true });

  module.exports = mongoose.model('liquidacion', liquidacionSchema);