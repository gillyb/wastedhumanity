const express = require('express');
const bodyParser = require('body-parser');

const videoRepo = require('./videoRepository');
const youtubeProvider = require('./youTubeProvider');

app = express();

app.disable('x-powered-by');

app.set('env', 'development'); // TODO: this should be defined in process.env.NODE_ENV - don't know where this is though...
app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// static libraries
app.use(express.static(__dirname + '/scripts'));
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/img'));
app.use(express.static(__dirname + '/public'));

// controllers
require('./controllers/mainController.js');
require('./controllers/aboutController.js');


// first load all the initial youtube videos we need
console.log('loading all videos needed for homepage.');
Promise.all([

    youtubeProvider.getHomePageVideos(videoRepo.popularVideos),
    youtubeProvider.getHomePageVideos(videoRepo.favoriteVideos)

]).then(() => {

    console.log(' :: Done initial loading.');
    console.log(' :: Starting server...');

    // start listening...
    app.listen(Number(process.env.PORT || 5000)).on('error', function(ex) {
        console.log(ex);
    });

});