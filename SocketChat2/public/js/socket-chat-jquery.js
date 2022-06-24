var params = new URLSearchParams(window.location.search);

// Referencias de jQuery
var divUsuarios= $('#divUsuarios');

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