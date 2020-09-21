const ProveedoresModel = require('../models/proveedores');
const Items = require('../models/items');

module.exports = function(app) {
    app.get('/proveedores', async function(req, res) {
    	const prov = await ProveedoresModel.find({});
    	const userData = {
	      user:   req.session.user,
	      role:   req.session.role,
	      logged: req.session.logged         
	    };
		const data = await Items.find({});

		return res.json({data});
    	// const data = {proveedores:prov, userData: userData};
    	// return res.render('/proveedores', data);
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
}
