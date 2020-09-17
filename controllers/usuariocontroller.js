const UsuarioModel = require('../models/usuarios');
const md5 = require('md5');
const jwt = require("jsonwebtoken");

module.exports = function(app) {
    
    app.get('/logout', function(req, res) {
        if(req.session.logged) {
            req.session.token = '';
            req.session.role = null;
            req.session.user = null;
            req.session.logged = false;
        }
        return res.redirect('/');
    });
    
    app.post('/login', async function(req, res) {

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
        const dbUser = await UsuarioModel.findOne({ usuario: user.usuario });
        
        if( md5(user.contras) === dbUser.contras ) {

            const payload = { usuario: user.usuario };
            const token = jwt.sign(payload, app.get('secreto'), {
                expiresIn: (1440 * 120 * 2)
            });

            req.session.token = token;
            req.session.role = dbUser.role;
            req.session.user = user.usuario;
            req.session.logged = true;


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
        console.log(error)
        return res.json({
            ok: false,
            error
        })
    }
    
    });
}
