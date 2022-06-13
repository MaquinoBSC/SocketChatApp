let usuario= null;
let token= null;

const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://restserver-curso-fher.herokuapp.com/api/auth/';


// Validar el token de Local Storage
const validarJWT= async()=> {
    const token= localStorage.getItem('token') || '';

    if(token.length < 10){
        window.location= 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp= await fetch( url, {
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB }= await resp.json();
    localStorage.setItem('token', tokenDB);
    usuario= userDB;
}

const main= async()=> {
    await validarJWT();
}

main();

// const socket= io();