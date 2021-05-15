require('dotenv').config()
const pantallasModel = require('../models/pantallas');

module.exports = (io) => {
    let pantalla = io.of('/pantalla');
    
    pantalla.on('connection', (client) => {
        client.on('articulo', (socket) => {
            let articulo = socket.articulo;
            client.to(articulo.client_id).emit('mostrarArticulo', {articulo});
        });

        client.on('login', async (socket) => {
            let user = socket.user;
            let pantalla = await (new pantallasModel({client_id: client.id, usuario: user})).save();
            client.broadcast.emit('nuevaPantalla', pantalla);
        })

        client.on('disconnect', async (socket) => { 
            await pantallasModel.deleteOne({ client_id: client.id });
            client.broadcast.emit('pantallaEliminada', client.id);
        });
    });
    

}