const { Socket }= require('socket.io');
const { comprobarJWT } = require('../helpers');
const { ChatMensajes } = require('../models');


const chatMensajes= new ChatMensajes();


const socketController= async ( socket= new Socket, io )=> {
    const usuario= await comprobarJWT(socket.handshake.headers['x-token']);
    if( !usuario ){
        return socket.disconnect();
    }

    // Agregar al nuevo usuario conectado
    // Hacemos uso de la instancia io debido a que es el servidor de socket y este tiene a todos los clientes que estan conectados 
    chatMensajes.conectarUsuario( usuario );
    io.emit('usuarios-activos', chatMensajes.usuariosArr );
    
    // Limpiar cuando alguien se desconecta
    // usamos socket pues este es el que mantiene la conexion directa con cada uno de los clientes
    // para saber cuando un cliente es desconectado socket es el indicado para saberlo 
    socket.on('disconnect', ( pay )=> {
        chatMensajes.usuarioDesconectado( usuario._id );
        // emitimos el evento a todos los clientes conectados de que un cliente se desconecto
        io.emit('usuarios-activos', chatMensajes.usuariosArr );
    });

    //Recibimos el mensaje que nos mande cualquier cliente
    socket.on('enviar-mensaje', ({ uid, mensaje })=> {
        // Guardamos el mensaje, junto con el id y nombre del cliente que lo envia
        // dado que usuario es una instancia de cada conexion que se genera, el id y el nombre
        // de este usuario es el mismo usuario que emite el evento 'enviar-mensaje'
        chatMensajes.enviarMensaje( usuario._id, usuario.nombre, mensaje);
        // por medio del server socket hacemos el envio del mensaje a todos los clientes concetados
        io.emit('recibir-mensajes', chatMensajes.ultimos10 );
    });
}

module.exports= {
    socketController
}