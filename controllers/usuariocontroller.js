const UsuarioModel = require('../models/usuarios');
const md5 = require('md5');

module.exports = function(app) {
    app.get('/login', function(req, res) {
        return res.render('login');
    })
    
    app.post('/login', async function(req, res) {
    let body
    if( !req.body ) {
        return res.json({
        ok: false,
        msg: "Completa el formulario"
        });
    } else {
        body = req.body;
    }
    
    try {
        const user = new UsuarioModel(req.body);
        console.log(user)
        const dbUser = await UsuarioModel.findOne({nick: user.nick});
        console.log(dbUser)

        if( md5(user.contras) == dbUser.contras ) {
            return res.json({
                ok: true,
                msg: 'Autorizado'
            })
        } else {
            return res.json({
                ok: false,
                msg: 'Contraseña o usuario incorrectos.'
            })
        }

    } catch (error) {
        return res.json({
            ok: false,
            error
        })
    }
    
    });
}