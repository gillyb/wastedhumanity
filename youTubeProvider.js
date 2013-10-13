
var https = require('https');

var youtubeApiKey = 'AIzaSyA0xWbm5Q7SF5aFZQJ8EGmb6fNc8cjQEwg';

var _getVideoId = function(url) {
    
    var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
	var match = url.match(regExp);
	if (match && match[1].length == 11)
	    return match[1];

    return null;
};

var _getVideoInfo = function(videoId, callback) {

	var options = {
		'method': 'GET',
		'host': 'www.googleapis.com',
		'port': 443,
		'path': '/youtube/v3/videos?part=contentDetails,statistics,snippet&id=' + videoId + '&key=' + youtubeApiKey
	};
	var data = '';

	https.request(options, function(res) {
		console.log(res.statusCode);
		res.on('data', function(d) {
			data += d;
		});
		res.on('end', function() {
			try {
				var videoData = extractVideoData(data);
				callback(videoData);
			}
			catch (e) {
				console.log('error extracting video data. Error: ' + e);
				console.log(data);
				callback(null);
			}
		});
	})
	.on('error', function(er) {
		console.log(er);
		callback(null);
	})
	.end();
};

function extractVideoData(data) {
	var jsonObj = JSON.parse(data.toString());
	var videoObj = jsonObj['items'][0];

	var videoName = videoObj['snippet']['title'];
	var videoLength = videoObj['contentDetails']['duration'];
	var videoViewCount = videoObj['statistics']['viewCount'];
	var videoThumbnail = videoObj['snippet']['thumbnails']['default']['url'];

	return {
		title: videoName.replace('\'', '\\\'').replace('"', '\"'),
		length: videoLength.replace('\'', '\\\'').replace('"', '\"'),
		views: videoViewCount.replace('\'', '\\\'').replace('"', '\"'),
		thumbnail: videoThumbnail.replace('\'', '\\\'').replace('"', '\"')
	};
}

exports.getVideoId = _getVideoId;
exports.getVideoInfo = _getVideoInfo;