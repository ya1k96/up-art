const UsuarioModel = require('../models/usuarios');
const md5 = require('md5');
const jwt = require("jsonwebtoken");
const rutas = require('../middlewares/rutasProtegidas');
const ItemModel = require('../models/items');
var cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: 'jungoma', 
    api_key: '991531246991727', 
    api_secret: 'NKO2N9cc_vGo_tgTNHC2NPyuzSA' 
  });
var multer  = require('multer')
var upload = multer()
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

    app.get('/main-admin', rutas.admin, async function(req,res) {
        const userData = {
            user: req.session.user,
            role: req.session.role,
            logged: req.session.logged         
        };
        return res.render('mainAdmin', {userData: userData});
    });

    app.get('/images-control', rutas.client, function(req, res){
        const userData = {
            user: req.session.user,
            role: req.session.role,
            logged: req.session.logged         
        };
        return res.render('images', {userData: userData});
    });
    
    app.get('/images-list/:n', rutas.client, async function(req, res){
        let pag = 0;
        let limit = 20;
        if (req.params.n) { pag = (req.params.n - 1) };

        const articulos = await ItemModel.find({image: true})        
        .skip( (pag * limit) )
        .limit(limit)
        .exec();

        const totalDocuments = await ItemModel.find({image: true}).count();
        const totalPaginas = Math.ceil(totalDocuments/limit)        

        return res.json({
            articulos,
            totalDocuments,
            paginaActual: (pag + 1),
            paginas: totalPaginas
        });
    });

    app.get('/buscar-articulo/:q', rutas.client, async function(req, res){
        const articulos = await ItemModel.find({ codigo: req.params.q, image: true })

        return res.json({
            articulos
        });
    });

    app.get('/upload-lote', rutas.admin, function(req, res) {
        const userData = {
            user: req.session.user,
            role: req.session.role,
            logged: req.session.logged         
        };
        return res.render('subirLote', {userData: userData});
    });

    app.post('/upload-lote', rutas.admin, async function(req, res) {
        if( req.files.file.length == 0 ) {
            return res.redirect(403,'../error-upload');
        }
        console.log(req.files)
        const archivos = req.files.file;
        let json = await getNamesFormated(archivos);        
        let itemsNoEncontrados = [];

        for (let index = 0; index < archivos.length; index++) {
            let codigo = json[0].split('.')[0];
            const item = await ItemModel.findOne({ codigo: codigo });
            //Lista de no encontrados
            if( !item ) { itemsNoEncontrados.push(json[0]); continue };

            //almacenamos temporalmente el archivo para subirlo al servidor Cloudinary
            const pathImg = `./public/files/${archivos[index].name}`;
            archivos[index].mv(pathImg,err => {
                if(err) return res.status(500).json({ ok:false, msg: err })
            });

            try {
                const imgUrl = await cloudinary.uploader.upload(pathImg); 
                const fs = require('fs')

                fs.unlinkSync(pathImg)
                               
                item.img_url = imgUrl.url;
                item.image = true;
                await item.save();

            } catch (error) {
                console.log(error)
            }
        }
       
        return res.json({ itemsNoEncontrados, msg: 'Exito' })
    });

    app.get('/images/confirm/:id', async function(req, res) {
        if( !req.param.id ) return res.json({ok: false, msg: "Provee un id"});
        const decision = req.body.decision;
        const id = req.param.id;

        switch( decision ) {
            case 'no':
                await ItemModel.findByIdAndUpdate(id, { revisado: true })
            break;
            default:
                await ItemModel.findByIdAndUpdate(id, { aprobado: true, revisado: true })
            break;
        }

    }); 

}

//Funcion para dar formato al nombre de las imagenes
function getNamesFormated(archivos) {
    return new Promise((resolve, reject) => {
        let json = [];
        for(let i = 0; i != archivos.length; i++) {
            let nameList = archivos[i].name.split('-');
            
            let nameToSave = nameList[0]+ ' ';
            for (let n = 1; n != nameList.length; n++) {
                if( n === (nameList.length -1) ) {
                    nameToSave += nameList[n];
                } else {
                    nameToSave += nameList[n] + '/';
                }
                
            }
            
            json.push(nameToSave)
        };
        return resolve(json);
    })
}
