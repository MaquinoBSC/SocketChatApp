const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');

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

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        client.broadcast.emit('crear-mensaje', { usuario: 'Administrador', mensaje: `${personaBorrada.nombre} salió del chat`});
        client.broadcast.emit('lista-personas', usuarios.getPersonas());
    });
});