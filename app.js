var express = require('express');
var bodyparser = require('body-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config()
var mongoose = require('mongoose');
var session = require('express-session');
const path = require('path');

//Controladores
const todocontroller = require('./controllers/todocontroller.js');
const usuariocontroller = require('./controllers/usuariocontroller.js');
const proveedoresController = require('./controllers/proveedores.js');
const imagenesController = require('./controllers/imagenes.js');

const dbUser = process.env.DBUSER;
const dbPass = process.env.DBPASS;
const urlDB  = process.env.DBURL
const urlMongo = 'mongodb://'+ dbUser + ':'+ dbPass + urlDB; 
mongoose.connect(urlMongo,{ useMongoClient: true });

const db = mongoose.connection;
//Conexion a la base de datos

var app = express();
var urlencodedparser = bodyparser.urlencoded({ extended: true}); // ??

db.once("open", function(){
  console.log("Conectado a la bd")
});

db.on("error", function(er){
  console.log("No se pudo conectar a la base de datos")
  console.log(er);
  app.get('/', function(req, res) {
    res.render('events/error');
  })
})

app.set('secreto', process.env.SECRET)
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  user: null,
  token: null,
  role: null,
  logged: false
}))

app.use(urlencodedparser)
app.use(bodyparser.json())
app.use(fileUpload())
// Set up template engine

// Static files
const pathFile = path.join(__dirname, 'dist/articulos-front' );
app.use(express.static(pathFile));

app.get('/', async function (request, response) {
    response.sendFile('index.html', {root: 'dist/articulos-front'});

});


//controladores
todocontroller(app);
usuariocontroller(app);
proveedoresController(app);
imagenesController(app);

// Listen to port

var port_number = (process.env.PORT || 3000);
app.listen(port_number);
console.log("Your Listening to the port", port_number)