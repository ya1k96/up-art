const fs = require('fs-extra');
var path = require('path');
const cloudinary = require('cloudinary');
require('dotenv').config()
const imagenes_model = require('../models/imagenes');
const rutas = require('../middlewares/rutasProtegidas');

module.exports = function(app) {
    //TODO: Mover esta info a las variables de entorno
    cloudinary.config({
        cloud_name: "jungoma",
        api_key:"991531246991727",
        api_secret: "NKO2N9cc_vGo_tgTNHC2NPyuzSA"
    });    

    app.get('/imagenes', async function(req, res) {
        const userData = {
            user: req.session.user,
            role: req.session.role,
            logged: req.session.logged
        };
        
        const imagenes = await imagenes_model.find({});

        return res.render('imagenes', {userData, imagenes});
    });

    
    
    app.get('/lista-imagenes', async function(req, res) {

        const userData = {
            user: req.session.user,
            role: req.session.role,
            logged: req.session.logged
        };        

        return res.render('lista_imagenes', {userData});
    });

    app.get('/api/lista-imagenes/:pagina', async function(req, res) {
        const pagina = req.params.pagina ? req.params.pagina : 1;
        const cantidad = req.query.cantidad ? req.query.cantidad : 25;

        const options = {
            page: pagina,
            limit: cantidad,
        };
        
        const result = await imagenes_model.paginate({
        }, options);      

        return res.json({
            ok: true,
            result
        });
    });

    app.get('/api/buscar-imagen', async function(req, res) {
        const query = req.query.keyword;

        let resp = await imagenes_model.find({
            code_name: { $regex: query }
        });

        return res.json({
            ok: true,
            docs: resp
        });

    });

    app.get('/api/imagen/:id', async (req, res) => {
        const id = req.params.id;
        if( !id ) {
            return res.status(402).json({
                ok: false,
                msg: "Debes proveer un id."
            });
        }

        const resp = await imagenes_model.find({"code_name": id});

        return res.json({
            ok: true,
            imagen: resp
        });
    });

    app.post('/imagenes', rutas.admin, async function(req, res) {
        //Asignamos la lista de imagenes que vienen del formulario
        let archivos = req.files.image;
        if( archivos.length == 0 ) return res.json({ok: false, msg: 'Tienes que seleccionar archivos'});

        //Marcara los errores ocurridos durante la llamada a esta uri
        let errors = [];
        let mimetype_errors = [];

        //Respuesta para la solicitud, posteriormente se completa agragando leyendas y/o modificando su contenido
        let response = {
            ok: true                
        };

        if( archivos.name ) {
            //TODO: comportamiento para tratar solo una imagen
            let ext = (path.extname(archivos.name)).toLowerCase();
                if ( ext === '.jpg' || ext === '.jpeg' || ext  ==='.png' ) {                                                 
                    
                    //Configuracion de la direccion del archivos
                    const img_path = path.join( __dirname, `../public/images/items/`, archivos.name);

                    archivos.mv( img_path, async err => {       

                        if(err) {
                            errors.push({ error: 'img', msg: err });
                        } else {
                            //para subir con el nombre original del artchivo: { use_filename: true }
                            const resp = await cloudinary.v2.uploader.upload(img_path, 
                            {
                                use_filename: true                                
                            });
                            
                            //console.log(resp);

                            const new_image = {
                                code_name: resp.original_filename,
                                img_url: resp.url,
                                public_id: resp.public_id
                            };

                            //Borramos la imagen del directorio
                            fs.unlink(img_path);

                            try {
                                await imagenes_model(new_image).save();        
                                                        
                            } catch (error) {
                                if( error.code === 11000 ) {
                                   //Borrar del archivo cloudinary
                                   await cloudinary.v2.uploader.destroy(resp.public_id);
                                  }
                            }
                            //El archivo se guarda en la base de datos
                        }
                    });
                    

                } else {
                    
                    mimetype_errors.push({ nombre: archivos.name });

                }
        } else {           
            archivos.forEach( archivo => {
                let ext = (path.extname(archivo.name)).toLowerCase();
                if ( ext === '.jpg' || ext === '.jpeg' || ext  ==='.png' ) {                                                 
                    
                    //Configuracion de la direccion del archivo
                    const img_path = path.join( __dirname, `../public/images/items/`, archivo.name);

                    archivo.mv( img_path, async err => {       

                        if(err) {
                            errors.push({ error: 'img', msg: err });
                        } else {
                            //para subir con el nombre original del artchivo: { use_filename: true }
                            const resp = await cloudinary.v2.uploader.upload(img_path, 
                            {
                                use_filename: true                                
                            });
                            
                            //console.log(resp);

                            const new_image = {
                                code_name: resp.original_filename,
                                img_url: resp.url,
                                public_id: resp.public_id
                            };

                            //Borramos la imagen del directorio
                            fs.unlink(img_path);

                            try {
                                await imagenes_model(new_image).save();                                
                            } catch (error) {
                                if( error.code === 11000 ) {
                                   //Borrar del archivo cloudinary
                                   await cloudinary.v2.uploader.destroy(resp.public_id);
                                  }
                            }
                            //El archivo se guarda en la base de datos
                        }
                    });
                    

                } else {
                    
                    mimetype_errors.push({ nombre: archivo.name });

                }
                
            });            
            
        }
        if(mimetype_errors != 0) errors.push({ error: 'Formato invalido', archivos: mimetype_errors });

        if(errors.length != 0) response.errors = errors;

        return res.json(response);

    });
}