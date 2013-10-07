
var youtubeProvider = require('../youTubeProvider');
var cacheProvider = require('../cacheProvider');

app.get('/', function(req, res) {

	var popularVideoIds = [
		'9bZkp7q19f0', 'jofNR_WkoCE', 'QH2-TGUlwu4', 'kffacxfA7G4',
		'vSW04S2YbCY'
	];

	var _videos = [];

	// check if we have them in the cache already
	var videoCount = 0;
	popularVideoIds.forEach(function(videoId) {
		var cacheValue = cacheProvider.get(videoId);

		if (cacheValue != null)
			_videos.push({
				videoId: videoId,
				videoInfo: videoInfo
			});
		else
			_videos.push({
				videoId: videoId,
				videoInfo: { title:'', length:'', views:'', thumbnail:'' }
			});

		console.log(JSON.stringify(_videos));
		res.render('homepage', {videos:_videos});
	});
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