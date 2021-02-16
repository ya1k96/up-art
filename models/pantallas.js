const mongoose = require('mongoose');
// Create Schema
var pantallasSchema = new mongoose.Schema({
    usuario: {
        type: String,
        unique: true
    },
    client_id: {
        type: String,
    }
});

module.exports = mongoose.model('pantallas', pantallasSchema);