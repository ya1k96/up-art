const mongoose = require('mongoose')
// Create Schema
var usuarioSchema = new mongoose.Schema({
   usuario: {
    type: String,
    unique: true,
    required: true
   },
   contras: {
    type: String,
    required: true
   },
   email: {
       type: String
   },
   role: {
       type: String,
       enum: ["admin", "client"],
       default: "client"
   }
  });

  module.exports = mongoose.model('usuarios', usuarioSchema);