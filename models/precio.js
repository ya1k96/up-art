const mongoose = require('mongoose');
// Create Schema
var precioSchema = new mongoose.Schema({
    precio: {
        type: Number
    },
    tipoArticulo: {
        type: String
    }
});

module.exports = mongoose.model('precio', precioSchema);