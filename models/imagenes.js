const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
// Create Schema
var imgSchema = new mongoose.Schema({
    code_name: {
        required: true,
        type: String,
        unique: true        
    },
    muestra: {
        type: Boolean,
        default: false
    },
    img_url: {
        required: true,
        type: String
    },
    public_id: {
        type: String,
        requried: true
    },
    observaciones: [{
      type: mongoose.Schema.ObjectId,
      ref: 'observacion'
    }],
    descripcion: {
        type: String
    },
    tipo_articulo: {
        type: mongoose.Schema.ObjectId,
        ref: 'tipo_articulos',
        default: '608b4bc62cbad9ca7034af1d'
    },
    aprobado: {
        type: Boolean,
        default: null
    },
    liquidado: {
        type: Boolean,
        default: false
    },
    visto: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

imgSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('imagenes', imgSchema);