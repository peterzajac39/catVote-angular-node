/**
 * Module dependencies.
 */

const express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path');

const app = express();

// const { check, validationResult } = require('express-validator/check');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const logger = require('morgan');
const errorHandler = require('errorhandler');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/../dist/cat-app/');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, '/../dist/cat-app/')));

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

// Index.html route
app.get('/', routes.index);

app.post('/api/v1/log' , routes.insertLog);
app.get('/api/v1/getRandomCats' , routes.getRandomDocument);
app.get('/api/v1/getAllCats' , routes.getAllDocs);

http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});
