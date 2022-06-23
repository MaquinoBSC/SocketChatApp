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

        let personas= usuarios.agregarPersona(client.id, usuario.nombre);
        callback(personas);
    });
});