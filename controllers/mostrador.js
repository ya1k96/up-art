require('dotenv').config()
const imagenes_model = require('../models/imagenes');

module.exports = (io) => {
    io.once('connection', function(socket) {
        console.log('conectado sockets');

    });
    io.of('/mostrador', function(mostradorIO) {
        mostradorIO.once('connection', function(client) {
            console.log('Cliente conectado');
        })

    })


}