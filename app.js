var express = require('express');
var todocontroller = require('./controllers/todocontroller.js');
var bodyparser = require('body-parser');
const fileUpload = require('express-fileupload')

var app = express();
var urlencodedparser = bodyparser.urlencoded({ extended: true}); // ??

app.use(urlencodedparser)
app.use(bodyparser.json())
app.use(fileUpload())
// Set up template engine
app.set('view engine', 'ejs');

// Static files
app.use(express.static('./public'));

// Fire controllers
todocontroller(app);

// Listen to port
app.listen(3000);
console.log("Your Listening to the port 3000")
