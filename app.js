var express = require('express');
var todocontroller = require('./controllers/todocontroller.js');
var bodyparser = require('body-parser');
const fileUpload = require('express-fileupload');
const usuariocontroller = require('./controllers/usuariocontroller.js');

var app = express();
var urlencodedparser = bodyparser.urlencoded({ extended: true}); // ??

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
console.log("Your Listening to the port", (process.env.port||3000))