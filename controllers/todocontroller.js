const csvtojsonV2=require("csvtojson");
const ItemModel = require('../models/items');
const LogModel = require('../models/logs');
const LiquidacionModel = require('../models/liquidacion');
const moment = require('moment');
require('dotenv').config()

//midleware 
const rutas = require('../middlewares/rutasProtegidas');
moment.locale('es-es');

module.exports = function(app) {

app.get('/', async function (request, response) {
    const userData = {
      user: request.session.user,
      role: request.session.role,
      logged: request.session.logged         
    };
  

  // obtenemos los articulos de db
  const doc = await ItemModel.find({});
  let lastUpdate = (await LogModel.find({}).sort({fecha: -1}))[0];
  //formateamos la fecha para hacerla legible
  let momentFecha = moment(lastUpdate.fecha).fromNow();
  const info = { items: doc, titulo: "Articulos", fecha: momentFecha };

  response.render("todo", { info: info, userData: userData });

});

app.get('/login', function(req, res) {
  const userData = {
    user: req.session.user,
    role: req.session.role,
    logged: req.session.logged         
  };

  return res.render('login', {userData: userData});
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

    let archivoJson = [];
     lista.forEach( async function(item) {
      let data = {
        codigo: item.normales,
        tipoArticulo: 'Normal',
        observacion: item.observacion
      }

      if( !item.normales.length > 0) {
        data.tipoArticulo = 'Especial'
        data.codigo = item.especiales
      } 

      try {
        await ItemModel(data).save();
      } catch (error) {
        archivoJson.push(data.codigo)
      }
      
      })
      let resp = {ok: true, msg:'Tus datos fueron cargados', articulosRechazados: archivoJson};


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

  let liquidado = await ItemModel.find({liquidado: true});
  let data = {
    normal: normal.length,
    especial: especial.length, 
    liquidado: liquidado.length    
  };

  const userData = {
    user: req.session.user,
    role: req.session.role,
    logged: req.session.logged
  };

  return res.render('liquidar',{data: data, userData: userData});
});

app.get('/pedir-liquidacion', rutas.client, async function(req, res) {
  let lToAdd = {
    articulos: [],
    subTotalNormal: 0.0,
    subTotalEspecial: 0.0,
    total: 0.0,
    pagado: false
  }
  const articulosALiquidar = await ItemModel.find({liquidado: false});
  const listaNormal = articulosALiquidar.filter( item => item.tipoArticulo === 'Normal');
  const listaEspecial = articulosALiquidar.filter( item => item.tipoArticulo === 'Especial');

  let resp = { ok: false, msg: "Ha ocurrido un error. intenta nuevamente mas tarde"}

  if( articulosALiquidar.length > 0 ) {
    lToAdd.subTotalNormal = listaNormal.length * 5 
    lToAdd.subTotalEspecial = listaEspecial.length * 10 
    lToAdd.total = (lToAdd.subTotalEspecial + lToAdd.subTotalNormal)

    articulosALiquidar.forEach(async (item) => {
      item.liquidado = true; 
      lToAdd.articulos.push(item._id);      
      await item.save();
    })    

    if(await LiquidacionModel(lToAdd).save()) {
      resp.ok = true
      resp.msg = "Exito"
    }
  }
  
  return res.json(resp)
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
app.get('/liquidacion-list', async function(req, res){
  const liquidaciones = await LiquidacionModel.find({}, ['createdAt','pagado','total', 'subTotalNormal','subTotalEspecial']);
  return res.json(liquidaciones);
})

app.get('/liquidacion/:id', async function(req, res){
  const liquidacion = await LiquidacionModel.findById(req.params.id, ['createdAt','pagado','total', 'subTotalNormal','subTotalEspecial']);
  return res.json(liquidacion);
})

};
