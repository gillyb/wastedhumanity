
// https://www.googleapis.com/youtube/v3/videos?part=contentDetails%2Cstatistics&id=voNEBqRZmBc&key={YOUR_API_KEY}

var https = require('https');

var youtubeApiKey = 'AIzaSyA0xWbm5Q7SF5aFZQJ8EGmb6fNc8cjQEwg';
var options = {
	'method': 'GET',
	'host': 'www.googleapis.com',
	'port': 443,
	'path': '/youtube/v3/videos?part=contentDetails,statistics,snippet&id=9bZkp7q19f0&key=' + youtubeApiKey
};

console.log('making request to youtube api...');

https.request(options, function(res) {
	console.log(res.statusCode);
	res.on('data', function(d) {
		console.log(d.toString());
	});
})
.on('error', function(er) {
	console.log(er);
})
.end();
