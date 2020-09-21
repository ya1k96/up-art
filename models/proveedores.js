const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId;
// Create Schema
var proveedorSchema = new mongoose.Schema({
    nombre: String,
    articulos: [{ type: ObjectId, ref: 'articulos' }]
  });

  module.exports = mongoose.model('proveedores', proveedorSchema);