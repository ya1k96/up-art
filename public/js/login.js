$(document).ready(function() {
    var btnIngresar = $('#ingresar');

    if( btnIngresar ) {
        btnIngresar.on('click', ingresoHandler);
    }

})

function ingresoHandler(event) {
    var user        = $('#user');
    var contras     = $('#contras');

    event.preventDefault();
    let msgErr = '';
    if(user.val().length == 0) {
        msgErr += 'Ingresa tu Usuario\n'
    }

    if(contras.val().length == 0) {
        msgErr += 'Ingresa tu Contraseña'
    }

    if(msgErr.length == 0) {
        const data = {
            usuario: user.val(),
            contras: contras.val()
        }
        
        $.post('/login', data, function(resp) {
            if(!resp.ok) {
                alert("Contraseña o usuario incorrectos")
            } else {
                let user = JSON.stringify({ token: resp.token, user: data.usuario });
                //Almacenamos el usuario en storage
                localStorage.setItem('user', user);

                let url = window.location.href;
                let uri = url.split('/')[2];
                let http = url.split('/')[0];
                window.location.replace( http + '//' + uri + '/liquidar');
            }
        })
    } else {
        return alert(msgErr)

    }
}