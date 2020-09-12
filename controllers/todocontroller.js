var mongoose = require('mongoose');
const csvtojsonV2=require("csvtojson");
const ItemModel = require('../models/items');
const LogModel = require('../models/logs');
const moment = require('moment');
require('dotenv').config()
//midleware 
const rutaProtegida = require('../middlewares/rutasProtegidas');

moment.locale('es-es');
const dbUser = process.env.DBUSER;
const dbPass = process.env.DBPASS;
const urlDB  = process.env.DBURL
const urlMongo = 'mongodb://'+ dbUser + ':'+ dbPass + urlDB; 
mongoose.connect(urlMongo,{ useMongoClient: true });
const db = mongoose.connection;

db.once("open", function(){
  console.log("Conectado a la bd")
});
db.on("error", function(){
  console.log("No se pudo conectar a la base de datos")
})


module.exports = function(app) {


app.get('/', function  (request, response) {
  
  // obtenemos los articulos de db
  ItemModel.find({}, async function(error, doc) {
    if(error) throw error
    
    let lastUpdate = (await LogModel.find({}).sort({fecha: -1}))[0];
    //formateamos la fecha para hacerla legible
    let momentFecha = moment(lastUpdate.fecha).fromNow();
    const info = { items: doc, titulo: "Articulos", fecha: momentFecha }

    response.render("todo", { info: info });
  });

});

app.post('/upload', async function(req,res) {

  
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
       if(item.normales.length > 0) {
         let data = {
           codigo: item.normales,
           tipoArticulo: 'Normal',
           observacion: item.observacion
         }
         await ItemModel(data).save();
       } else {
        let data = {
          codigo: item.especiales,
          tipoArticulo: 'Especial',
          observacion: item.observacion
        }
        await ItemModel(data).save();
       }
       
      })
      return res.json({ok: true, msg:'Tus datos fueron cargados'});

  }
})

app.get('/upload', rutaProtegida, (req,res) => {
  return res.render("upload");
});


app.get('/error-upload', function(req,res) {
  return res.render('events/error-upload');
})

app.get('/liquidar', async function(req,res) {
  let normal = await ItemModel.find({'tipoArticulo': 'Normal', liquidado: false});
  let especial = await ItemModel.find({'tipoArticulo': 'Especial', liquidado: false});
  let liquidado = await ItemModel.find({liquidado: true});
  let data = {normal: normal.length, especial: especial.length, liquidado: liquidado.length};
  return res.render('liquidar',{data: data});
});
};
