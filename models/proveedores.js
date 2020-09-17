const mongoose = require('mongoose')
// Create Schema
var proveedorSchema = new mongoose.Schema({
    nombre: String,
    articulos: [{ type: ObjectId, ref: 'articulos' }]
  });

  module.exports = mongoose.model('proveedores', proveedorSchema);