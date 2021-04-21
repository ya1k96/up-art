const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');
// Create Schema
var articuloSchema = new mongoose.Schema({
    codigo: {
      type: String,
      unique: true
    },
    hecho: {
      type: Boolean,
      default: false
    },
    category: {
      type: String
    }
  });
  
  articuloSchema.plugin(mongoosePaginate);
  
  module.exports = mongoose.model('items', articuloSchema);