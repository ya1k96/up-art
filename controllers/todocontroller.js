var mongoose = require('mongoose');
var path = require('path');
const { Console } = require('console');
mongoose.connect('mongodb://ale39:Alejandro39@ds139909.mlab.com:39909/wherehouse',{ useMongoClient: true, /* other options */ });
const db = mongoose.connection;
db.once("open", function(){
  console.log("Conectado a la bd")
});
db.on("error", function(){
  console.log("No se pudo conectar a la base de datos")
})
// Create Schema
var articuloSchema = new mongoose.Schema({
  codigo: String,
  fecha: {
    type: [String],    
  },
  tipoArticulo: {
    type: String,
    enum: ["Normal", "Especial"],
    default:"Normal"
  },
  liquidado : {
    type: Boolean, 
    default: false
  },
  observacion: {
    type: String
  }
});
const csvtojsonV2=require("csvtojson");
const { response } = require('express');
// Create Model
var ItemModel = mongoose.model("articulos", articuloSchema);

// Save Item in Model
// var firstItem = TodoModel({ item: "Sachin Tendular"}).save(function(error) {
//   if(error) throw error;
//
//   console.log("Item Saved");
// })


module.exports = function(app) {


app.get('/', function  (request, response) {
  
  // Get todos from MongoDB
  ItemModel.find({}, function(error, data) {
    if(error) throw error
    const info = { items: data, titulo: "Articulos" }
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

  //TODO: Rechazar archivos que no sean tipo .csv
  
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

app.get('/upload', (req,res) => {
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
