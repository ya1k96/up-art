const csvtojsonV2=require("csvtojson");
const ItemModel = require('../models/items');
const LogModel = require('../models/logs');
const PrecioModel = require('../models/precio'); 
const CategoryModel = require('../models/categories'); 
const LiquidacionModel = require('../models/liquidacion');
const LiquidacionDetalle = require("../models/liquidacionDetalle");
const moment = require('moment');
require('dotenv').config()
const path = require('path');
//midleware 
const rutas = require('../middlewares/rutasProtegidas');
const imagenes = require("../models/imagenes");
moment.locale('es-es');

module.exports = function(app) {

// app.get('/asoc', async (req, res) => {
//   const items = await ItemModel.find({});
//   items.forEach(async el => { 
//     const auxName = el.codigo.split(' ');
//     let nameQuery = '';

//     if(auxName.length > 0) {
//       for (let index = 0; index < auxName.length; index++) {
//         nameQuery += auxName[index] + (index === auxName.length ? '' : '-');
        
//       }
      
//     }

//     let img = await ImagenesModel.find({code_name: ''});

//     if( img.length === 1 ) {
//       el.imagen = img[0]._id;
//       await el.save();
//     }
//    })
//     res.json({
//       ok: true
//     })
// });



app.get('/api/articulos/:pagina', async function (req, response) {
    const pagina = req.params.pagina ? req.params.pagina : 1;
    const cantidad = req.query.cantidad ? req.query.cantidad : 25;
    const categoria = req.query.categoria;

    const options = {
        page: pagina,
        limit: cantidad
    };
    const userData = {
      user: req.session.user,
      role: req.session.role,
      logged: req.session.logged         
    };
  // obtenemos los articulos de db
  let doc; 
  
  if( categoria !== 'undefined') {
    doc = await ItemModel.paginate({category: categoria}, options );
  } else {
    doc = await ItemModel.paginate({}, options );
  }
  const categorias = await CategoryModel.find({});
  //Buscamos en orden descendente el primer record
  let lastUpdate = (await LogModel.find({}).sort({fecha: -1}))[0];
  //formateamos la fecha para hacerla legible
  let momentFecha = moment(lastUpdate.fecha).fromNow();
  const info = { doc, titulo: "Articulos", fecha: momentFecha };
  
  return response.json({
    ok: true,
    items: info,
    userData,
    categorias
  });
});

app.get('/api/buscarArticulo',async function(req, res) {
  const query = req.query.codigo;
  const resp = await ItemModel.find({codigo: { $regex: query }});

  return res.json({ok: true, resp});
});

app.get('/login', function(req, res) {
  const userData = {
    user: req.session.user,
    role: req.session.role,
    logged: req.session.logged         
  };

  return res.render('login', {userData: userData});
})
app.post('/upload-category', async function(req,res) {

  
  if( !req.files.file ) {
    return res.redirect(403,'../error-upload');
  }

  let archivo = req.files.file;
  //Guardamos el tipo de archivo para corroborar
  let mimetype = archivo.name;

  if(!mimetype.includes('csv')) {
    //Error de tipo
    return res.status(401).json({
      msg: "Este tipo de archivo no esta permitido"
    })
  }

  const pathcsv = `./public/files/${archivo.name}`;
  archivo.mv(pathcsv,err => {
    if(err) return res.status(500).json({ ok:false, msg: err });
  })

  const lista = await csvtojsonV2().fromFile(pathcsv);
  let codigoAux;
  if(lista.length > 0) {

     lista.forEach( async function(item) {       
       //Buscamos el item
       const itemDB = await ItemModel.find({codigo: item.codigo});
       //Nos aseguramos de que el item se encuentra en la base de datos
       if( itemDB.length === 1) {
         //Guardamos la nueva categoria del item
         categoryName = (await CategoryModel.findOne({name: item.category}));
         if(! categoryName ) {
          categoryName = await CategoryModel({name: item.category}).save();
         }
           itemDB[0].category = categoryName._id;
           await itemDB[0].save();        
         }
      })

      let resp = {ok: true, msg:'Tus datos fueron cargados'};

      
    } else {
      return res.json({ok: false, msg: "El documento esta vacio"})
    }
    return res.json({ok: true, msg: 'Cargado'});
})

app.post('/upload-description', rutas.admin, async function(req,res) {

  
  if( !req.files.file ) {
    return res.redirect(403,'../error-upload');
  }

  let archivo = req.files.file;
  //Guardamos el tipo de archivo para corroborar
  let mimetype = archivo.name;

  if(!mimetype.includes('csv')) {
    //Error de tipo
    return res.status(401).json({
      msg: "Este tipo de archivo no esta permitido"
    })
  }

  const pathcsv = `./public/files/${archivo.name}`;
  archivo.mv(pathcsv,err => {
    if(err) return res.status(500).json({ ok:false, msg: err });
  })

  const lista = await csvtojsonV2().fromFile(pathcsv);
  let codigoAux;
  if(lista.length > 0) {

     lista.forEach( async function(item) {
       codigoAux = (item.codigo.split(' ')).join('-');
       codigoAux = (codigoAux.split('/')).join('-');
       //Buscamos el item
       const itemDB = await imagenes.find({code_name: codigoAux});
       //Nos aseguramos de que el item se encuentra en la base de datos
         if( itemDB.length === 1) {
           //Guardamos la nueva descripcion del item
           itemDB[0].descripcion = item.descripcion;
           await itemDB[0].save();        
         }
      })

      let resp = {ok: true, msg:'Tus datos fueron cargados'};

      
    } else {
      return res.json({ok: false, msg: "El documento esta vacio"})
    }
    return res.json({ok: true, msg: 'Cargado'});
})


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

     lista.forEach( async function(item) {
      let data = {
        codigo: item.normales,
        tipoArticulo: 'Normal',
        descripcion: item.descripcion
      }

      if( !item.normales.length > 0) {
        data.tipoArticulo = 'Especial'
        data.codigo = item.especiales
      } 

      try {
        await ItemModel(data).save();
      } catch (error) {

        if( error.code === 11000 ) {
          const itemDB = (await ItemModel.find({codigo: error.keyValue.codigo}))[0];
          itemDB.descripcion = item.descripcion;

          await itemDB.save();
        }

      }
      
      })

      let resp = {ok: true, msg:'Tus datos fueron cargados'};

      return res.json(resp);

  } else {
    return res.json({ok: false, msg: "El documento esta vacio"})
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


app.get('/error-upload', function(req,res) {
  return res.render('events/error-upload');
})

app.get('/liquidar', rutas.client, async function(req,res) {
  const articulosALiquidar = await ItemModel.find({liquidado: false});
  const normal = articulosALiquidar.filter( item => item.tipoArticulo === 'Normal');
  const especial = articulosALiquidar.filter( item => item.tipoArticulo === 'Especial');
  const listaPrecios = await PrecioModel.find({});
  const precioNormal = listaPrecios[1].precio;
  const precioEspecial = listaPrecios[0].precio;

  let data = {
    normal: normal.length,
    especial: especial.length, 
    precioEspecial,
    precioNormal 
  };

  console.log(data);

  const userData = {
    user: req.session.user,
    role: req.session.role,
    logged: req.session.logged
  };

  return res.render('liquidar',{data: data, userData: userData});
});

app.get('/api/liquidar', rutas.client, async function(req,res) {
  const articulosALiquidar = await ItemModel.find({liquidado: false});
  const normal = articulosALiquidar.filter( item => item.tipoArticulo === 'Normal');
  const especial = articulosALiquidar.filter( item => item.tipoArticulo === 'Especial');
  const listaPrecios = await PrecioModel.find({});
  const precioNormal = listaPrecios[1].precio;
  const precioEspecial = listaPrecios[0].precio;

  let data = {
    normal: normal.length,
    especial: especial.length, 
    precioEspecial,
    precioNormal 
  };

  return res.json({
    ok: true,
    data
  });
});

app.get('/pedir-liquidacion', rutas.client, async function(req, res) {
  
  const articulosALiquidar = await ItemModel.find({liquidado: false});

  const listaNormal = articulosALiquidar.filter( item => item.tipoArticulo === 'Normal');
  const listaEspecial = articulosALiquidar.filter( item => item.tipoArticulo === 'Especial');

  const listaPrecios = await PrecioModel.find({});

  const precioNormal = listaPrecios[1].precio;
  const precioEspecial = listaPrecios[0].precio;

  let liquidacionDetalleNormal = null;
  let liquidacionDetalleEspecial = null;

  if( listaNormal.length > 0 ) {    

    liquidacionDetalleNormal = await LiquidacionDetalle({
      articulos: listaNormal.map(el => el._id ),
      precio: precioNormal,
      cantidad: listaNormal.length,
      subtotal: precioNormal * listaNormal.length      
    }).save();

  }

  if( listaEspecial.length > 0 ) {
    liquidacionDetalleEspecial = await LiquidacionModel({
      articulos: listaEspecial.map(el => el._id ),
      precio: precioEspecial,
      cantidad: listaEspecial.length,
      subtotal: precioEspecial * listaEspecial.length
    }).save();
  }

  await LiquidacionModel({
    liquidacionDetalle: [
      liquidacionDetalleEspecial._id,liquidacionDetalleNormal._id
    ],
    total: (listaEspecial.length * precioEspecial) + (listaNormal * precioNormal)    
  }).save();
  
  return res.json({ok: true});
});

app.get('/rollback/:id', rutas.admin, async function(req, res) {
  if(!req.params.id) {
    return res.json({ok: false, msg: "Provee los datos necesarios"})
  }
  const liquidacion = await LiquidacionModel.findById({ _id: req.params.id })
  .populate('articulos', 'liquidado')
  if( !liquidacion ) {
    return res.json({ok: false, msg: "Id no encontrado"})
  }

  liquidacion.articulos.forEach(async item => {
    item.liquidado = true
    await item.save()
  })

  return res.json(liquidacion)

})

//Unicamente AJAX
app.get('/api/liquidacion-list', rutas.admin, async function(req, res){
  const liquidaciones = await LiquidacionModel.find({}, ['createdAt','pagado','total'])
  .populate('liquidacionDetalle')
  return res.json(liquidaciones);
})

app.get('/liquidacion/:id', async function(req, res){
  const liquidacion = await LiquidacionModel.findById(req.params.id, ['createdAt','pagado','total'])
  .populate('liquidacionDetalle')
  return res.json(liquidacion);
})
  
  function liquidarITems(lista) {
    lista.forEach(async (item) => {
      item.liquidado = true; 
      await item.save();
    })    

  }

};
