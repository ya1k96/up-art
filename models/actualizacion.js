const mongoose = require('mongoose')
// Create Schema
var actualizacion = new mongoose.Schema({
  codigo: { type: mongoose.Schema.ObjectId, ref: "articulos" },
  tipo: {
    type: String,
    enum:["Especial", "Normal"],
    default: "Normal"
  }
}, {timestamp: true});

module.exports = mongoose.model('actualizacion', actualizacion);