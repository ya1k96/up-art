const mongoose = require('mongoose')
// Create Schema
var liquidacionSchema = new mongoose.Schema({
    codigo: {
      type: String,
      unique: true
    },
  });

  module.exports = mongoose.model('liquidacion', liquidacionSchema);