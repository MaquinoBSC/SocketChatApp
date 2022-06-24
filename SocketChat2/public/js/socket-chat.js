var socket = io();

const params = new URLSearchParams(window.location.search);
if(!params.has('nombre') || !params.has('sala')){
    window.location = 'index.html';
    throw new Error('El nombre es necesario');
}

const usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala'),
}

socket.on('connect', function() {
    socket.emit('entrar-chat', usuario, (resp)=> {
        console.log(resp);
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('crear-mensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crear-mensaje', (mensaje) => {
    console.log('Servidor:', mensaje);

});

// Escuchar cambio de usuario
// cuando un usuario entra o sale del chat
socket.on('lista-personas', (personas) => {
    console.log(personas);

});

socket.on('mensaje-privado', (mensaje)=> {
    console.log(mensaje);
});
