const { Socket }= require('socket.io');
const { comprobarJWT } = require('../helpers');
const { ChatMensajes } = require('../models');


const chatMensajes= new ChatMensajes();


const socketController= async ( socket= new Socket, io )=> {
    const usuario= await comprobarJWT(socket.handshake.headers['x-token']);
    if( !usuario ){
        return socket.disconnect();
    }

    // Agregar al usuario conectado
    chatMensajes.conectarUsuario( usuario );
    io.emit('usuarios-activos', chatMensajes.usuariosArr );
    
    // Limpiar cuando alguien se desconecta
    socket.on('disconnect', ( pay )=> {
        chatMensajes.usuarioDesconectado( usuario._id );
        io.emit('usuarios-activos', chatMensajes.usuariosArr );
    });
}

module.exports= {
    socketController
}