const mongoose = require('mongoose')
// Create Schema
var tipoArticulo = new mongoose.Schema({
    name: {
      type: String,
      unique: true
    },
    precio: {
        type: Number,
        required: true
    }    
  });
  
  module.exports = mongoose.model('tipo_articulos', tipoArticulo);