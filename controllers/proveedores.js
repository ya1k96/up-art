const ProveedoresModel = require('../models/proveedores');

module.exports = function(app) {
    app.get('/proveedores', async function(req, res) {
    	const prov = await ProveedoresModel.find({});
    	const userData = {
	      user:   req.session.user,
	      role:   req.session.role,
	      logged: req.session.logged         
	    };
 
    	const data = {proveedores:prov, userData: userData};
    	return res.render('/proveedores', data);
    });

    app.get('/proveedores/:id', async function(req, res) {
    	if( !req.query.id ) {
    		return res.status(402).json({ msg: "Provee un id" })
    	}

    	const prov = await ProveedoresModel.findOne({_id: req.query.id });

    	if( !prov ) {
    		return res.json({ ok: false, msg: "Proveedor no encontrado"});
    	}

    	return res.json({ ok: true, proveedor: prov });

    });

    app.post('/upload', rutas.admin, async function(req,res) {

  
      if( !req.files.file ) {
        return res.redirect(403,'../error-upload');
      }

      let archivo = req.files.file;
      //Guardamos el tipo de archivo para corroborar
      let mimetype = archivo.name;

      if(!mimetype.includes('csv')) {
        return res.status(401).json({
          msg: "Este tipo de archivo no esta permitido"
        })
      }
      const pathcsv = `./public/files/${archivo.name}`;
      archivo.mv(pathcsv,err => {
        if(err) return res.status(500).json({ ok:false, msg: err })
      })

      const lista = await csvtojsonV2().fromFile(pathcsv)
      if(lista.length > 0) {
        let fecha = moment();
        await new LogModel({fecha}).save()

        let archivoJson = [];
         lista.forEach( async function(item) {
                      
         })
        return res.json({ok: true, msg:'Tus datos fueron cargados'});

      }
    })

    app.get('/upload', rutas.admin, (req,res) => {
      const userData = {
        user: req.session.user,
        role: req.session.role,
        logged: req.session.logged         
      };

  return res.render("upload", {userData: userData});
});

}
