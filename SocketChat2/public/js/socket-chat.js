var socket = io();
var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrar-chat', usuario, (resp) => {
        renderizarUsuarios(resp);
    });
});

// escuchar
socket.on('disconnect', () => {
    console.log('Perdimos conexión con el servidor');
});

// Escuchar información
socket.on('crear-mensaje', (mensaje) => {
    renderizarMensajes(mensaje);
});

// Escuchar cambios de usuarios
// cuando un usuario entra o sale del chat
socket.on('lista-personas', (personas) => {
    renderizarUsuarios(personas);
});

// Mensajes privados
socket.on('mensaje-privado', (mensaje) => {
    console.log('Mensaje Privado:', mensaje);
});