$(document).ready(function() {

    var user        = $('#user');
    var contras     = $('#contras');
    var btnIngresar = $('#ingresar');

    btnIngresar.on('click', function(event) {
        event.preventDefault();
        let msgErr = false;
        if(user.val().length == 0) {
            msgErr =+ 'Ingresa tu Usuario'
        }

        if(contras.val().length == 0) {
            msgErr =+ 'Ingresa tu Contraseña'
        }

        if(!msgErr) {
            const data = {
                usuario: user.val(),
                contras: contras.val()
            }
            
            $.post('/login', data, function(data) {
                if(!data.ok) {
                    alert("Contraseña o usuario incorrectos")
                } else {
                    let user = JSON.stringify({ user: data.usuario });
                    localStorage.setItem('user', user);
                    let url = window.location.href;
                    let uri = url.split('/')[2];
                    window.location.replace('https://' + uri + '/liquidar');
                }
            })
        } else {
            return alert(msgErr)

        }

    })
})