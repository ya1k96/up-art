const mongoose = require('mongoose')
// Create Schema
var categorySchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true
    }    
  });
  
  module.exports = mongoose.model('category', categorySchema);