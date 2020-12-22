const mongoose = require('mongoose');
// Create Schema
var precioSchema = new mongoose.Schema({
    precio: {
        type: Number
    },
    type: {
        type: String
    }
});

module.exports = mongoose.model('precio', precioSchema);