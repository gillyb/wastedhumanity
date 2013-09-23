
var youtubeProvider = require('../youTubeProvider');
var cacheProvider = require('../cacheProvider');

app.get('/', function(req, res) {
	res.render('homepage');
});

app.post('/get-info', function(req, res) {
	var videoUrl = req.body.videoUrl;

	// extract the video id from the url
	var videoId = null;
	try {
		videoId = youtubeProvider.getVideoId(videoUrl);
	}
	catch (e) {
		// TODO: return some json response
		res.json({error:'error extracting youtube video id'});
	}

	// check if we have it in the cache
	var cacheValue = cacheProvider.get(videoId);
	if (cacheValue != null) {
		console.log('retrieved video info from cache');
		res.json(cacheValue);
	}

	// retrieve video info from youtube api
	var videoInfo = null;
	try {
		videoInfo = youtubeProvider.getVideoInfo(videoId, function(videoInfo) {
			cacheProvider.put(videoId, videoInfo, 3);
			res.json(videoInfo);
		});
	}
	catch (e) {
		// TODO: return some json response
		res.json({error:'error getting video info'});
	}

});