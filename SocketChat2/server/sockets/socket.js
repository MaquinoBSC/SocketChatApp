const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades');


const usuarios = new Usuarios();

io.on('connection', (client) => {
    client.on('entrar-chat', (usuario, callback)=> {
        if(!usuario.nombre){
            return callback({
                success: false,
                msg: 'El nombre es necesario'
            });
        }

        let personas = usuarios.agregarPersona(client.id, usuario.nombre);
        client.broadcast.emit('lista-personas', usuarios.getPersonas());
        callback(personas);
    });

    client.on('crear-mensaje', (data)=> {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.emit('crear-mensaje', mensaje);
    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        client.broadcast.emit('crear-mensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`));
        client.broadcast.emit('lista-personas', usuarios.getPersonas());
    });

    // Mensajes privados
    client.on('mensaje-privado', data => {
        console.log(data);
        let persona= usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensaje-privado', crearMensaje(persona.nombre, data.mensaje));
    });
});