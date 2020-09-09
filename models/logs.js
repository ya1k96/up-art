const mongoose = require('mongoose');
// Create Schema
var logSchema = new mongoose.Schema({
    event: {
        type: String,
        enum: ['Update'],
        default: 'Update'
    },
    fecha: {
        type: Date,
    }
});

module.exports = mongoose.model('logs', logSchema);