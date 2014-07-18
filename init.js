
var express = require('express');
app = express();

// configuration
app.configure(function() {
	app.disable('x-powered-by');

	app.set('env', 'development'); // TODO: this should be defined in process.env.NODE_ENV - don't know where this is though...
	app.set('view engine', 'jade');
	app.set('views', __dirname + '/views');

	app.use(express.logger());
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	// static libraries
	app.use(express.static(__dirname + '/scripts'));
	app.use(express.static(__dirname + '/css'));
	app.use(express.static(__dirname + '/img'));
	app.use(express.static(__dirname + '/public'));

	app.use(app.router);
});

// controllers
require('./controllers/mainController.js');
require('./controllers/aboutController.js');

// start listening...
app.listen(Number(process.env.PORT || 5000)).on('error', function(ex) {
	console.log(ex);
});