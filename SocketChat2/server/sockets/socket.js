const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades');


const usuarios = new Usuarios();

io.on('connection', (client) => {
    client.on('entrar-chat', (usuario, callback)=> {
        if(!usuario.nombre || !usuario.sala){
            return callback({
                success: false,
                msg: 'El nombre/sala es necesario'
            });
        }

        client.join(usuario.sala);

        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);
        client.broadcast.to(usuario.sala).emit('lista-personas', usuarios.getPersonaBySala(usuario.sala));
        client.broadcast.to(usuario.sala).emit('crear-mensaje', crearMensaje('Administrador', `${usuario.nombre} se unio`));
        callback(usuarios.getPersonaBySala(usuario.sala));
    });

    client.on('crear-mensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crear-mensaje', mensaje);

        callback(mensaje);
    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        client.broadcast.to(personaBorrada.sala).emit('crear-mensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`));
        client.broadcast.to(personaBorrada.sala).emit('lista-personas', usuarios.getPersonaBySala(personaBorrada.sala));
    });

    // Mensajes privados
    client.on('mensaje-privado', data => {
        console.log(data);
        let persona= usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensaje-privado', crearMensaje(persona.nombre, data.mensaje));
    });


});