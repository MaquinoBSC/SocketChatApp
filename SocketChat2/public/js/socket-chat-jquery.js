var params = new URLSearchParams(window.location.search);

let nombre = params.get('nombre');
let sala = params.get('sala');

// Referencias de jQuery
let divUsuarios = $('#divUsuarios');
let formEnviar = $('#form-enviar');
let textMensaje = $('#text-mensaje');
let divChatbox = $('#divChatbox');


// Funciones para renderizar usuarios
function renderizarUsuarios(personas){
    console.log(personas);

    let html = '';
    html += '<li>';
    html += '   <a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';
    html += '</li>';

    personas.forEach(persona => {
        html += '<li>';
        html += '   <a data-id="'+ persona.id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + persona.nombre + '<small class="text-success">online</small></span></a>';
        html += '</li>';
    });
    divUsuarios.html(html);
}

// Listeners
divUsuarios.on('click', 'a', function(){
    let id= $(this).data('id');
    if(id){
        console.log(id);
    }
});

formEnviar.on('submit', function(e){
    e.preventDefault();
    
    if(textMensaje.val().trim().length === 0){ return; }

    socket.emit('crear-mensaje', { nombre , mensaje: textMensaje.val() }, (mensaje)=> {
        textMensaje.val('').focus();
        console.log(mensaje);
        renderizarMensajes(mensaje);
        console.log(divChatbox);
    });
});

function renderizarMensajes(mensaje){
    let html = '';
    html += '<li class="animated fadeIn">';
    html +=     '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
    html +=     '<div class="chat-content">';
    html +=         '<h5>' + mensaje.nombre + '</h5>';
    html +=         '<div class="box bg-light-info">' + mensaje.mensaje + '</div>';
    html +=     '</div>';
    html +=     '<div class="chat-time">10:56 am</div>';
    html += '</li>';

    divChatbox.append(html);
}