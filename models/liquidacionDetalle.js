const mongoose = require('mongoose')
// Create Schema
var liquidacionSchema = new mongoose.Schema({
    articulos: [
        {
            type: mongoose.Schema.ObjectId, ref: "articulos"
        }
    ],
    tipoArticulo: {
        type: String
    },
    subTotal: String,
    cantidad: Number,
    precio: Number,
});

  module.exports = mongoose.model('liquidacionDetalle', liquidacionSchema);