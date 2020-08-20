
const express = require('express')
const app = express()
const port = 8080


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));




// set directory for view
app.set('views', __dirname + '/view');
//app.set("view engine", "ejs");

app.engine('html', require('ejs').renderFile);
// this is to set render engine, can set to pug if use pug

app.use(express.static('public'));
//serve static file such as image in public


// import routes
var router = require('./routes/routes.js');
app.use('/', router);






app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})