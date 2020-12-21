const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
// Create Schema
var imgSchema = new mongoose.Schema({
    code_name: {
        required: true,
        type: String,
        unique: true        
    },
    img_url: {
        required: true,
        type: String
    },
    public_id: {
        type: String,
        requried: true
    },
    comentario: {
        type: String
    },
    descripcion: {
        type: String
    }
}, { timestamps: true });

imgSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('imagenes', imgSchema);