var express = require('express');
var todocontroller = require('./controllers/todocontroller.js');
var bodyparser = require('body-parser');
const fileUpload = require('express-fileupload');
const usuariocontroller = require('./controllers/usuariocontroller.js');
require('dotenv').config()
var mongoose = require('mongoose');
var session = require('express-session')

const dbUser = process.env.DBUSER;
const dbPass = process.env.DBPASS;
const urlDB  = process.env.DBURL
const urlMongo = 'mongodb://'+ dbUser + ':'+ dbPass + urlDB; 

mongoose.connect(urlMongo,{ useMongoClient: true });

const db = mongoose.connection;
//Conexion a la base de datos
db.once("open", function(){
  console.log("Conectado a la bd")
});
db.on("error", function(){
  console.log("No se pudo conectar a la base de datos")
})

var app = express();
var urlencodedparser = bodyparser.urlencoded({ extended: true}); // ??

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
app.set('view engine', 'ejs');

//configuracion de cors
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

// Static files
app.use(express.static('./public'));

// Fire controllers
todocontroller(app);
usuariocontroller(app);

// Listen to port

var port_number = (process.env.PORT || 3000);
app.listen(port_number);
console.log("Your Listening to the port", port_number)