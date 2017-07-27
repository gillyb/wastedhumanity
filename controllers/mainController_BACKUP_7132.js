var youtubeProvider = require('../youTubeProvider');
var cacheProvider = require('../cacheProvider');

var popularVideos = ['9bZkp7q19f0', 'kffacxfA7G4', 'fWNaR-rxAic', 'QK8mJJJvaes', 'KQ6zr6kCPj8', 'qrO4YZeyl0I'];
var favoriteVideos = ['QH2-TGUlwu4', 'jofNR_WkoCE', 'uVTfszppJl8', 'nlt5Wa13fFU', 'EIyixC9NsLI', 'Lf2db4hD6zI',
    'cYNdUM2gRsg', 'VCEsveSK5to', 'IDtdQ8bTvRc', '2Tvy_Pbe5NA', 'K7l5ZeVVoCA', 'xfeys7Jfnx8',
    'khCokQt--l4', 'xDj7gvc_dsA', 'nZcRU0Op5P4', 'lVmmYMwFj1I'];

app.get('/', function (req, res) {
    // youtubeProvider.getTrendingVideos(10).then((trendingVideos) => {

<<<<<<< HEAD
        res.render('homepage', {
            videos: getHomePageVideos(popularVideos),
            favoriteVideos: getHomePageVideos(favoriteVideos),
            currentVideo: null
        });
    // });
=======
app.get('/', function(req, res) {
	res.render('homepage.jade', {
		videos: getHomePageVideos(popularVideos),
		favoriteVideos: getHomePageVideos(favoriteVideos),
		currentVideo:null
	});
>>>>>>> Update node_modules
});

app.get('/:videoId', function (req, res) {
    var videoId = req.params.videoId;
    res.render('homepage', {
        videos: getHomePageVideos(popularVideos),
        favoriteVideos: getHomePageVideos(favoriteVideos),
        currentVideo: videoId
    });
});

app.post('/get-info', function (req, res) {
    var videoId;
    var videoUrl = req.body.videoUrl;
    var useCache = req.body.useCache;

    if (videoUrl) {
        // TODO: add proper error handling in case we can't extract the youtube id
        videoId = youtubeProvider.getVideoId(videoUrl);
        console.log('got youtube id!! - ' + videoId);
    }
    else {
        videoId = req.body.videoId;
    }

    if (useCache) {
        var cacheValue = cacheProvider.get(videoId);
        if (cacheValue != null) {
            console.log('retrieved video info from cache');
            res.json(cacheValue);
            return;
        }
    }

    // retrieve video info from youtube api
    var videoInfo = null;
    try {
        videoInfo = youtubeProvider.getVideoInfo(videoId, function (videoInfo) {
            if (useCache)
                cacheProvider.put(videoId, videoInfo, 3);
            res.json(videoInfo);
            return;
        });
    }
    catch (e) {
        // TODO: return some json response
        res.json({error: 'error getting video info'});
        return;
    }

});

function getHomePageVideos(videoIds) {
    var _videos = [];

    // check if we have them in the cache already
    var videoCount = 0;
    videoIds.forEach(function (videoId) {
        var cacheValue = cacheProvider.get(videoId);

        if (cacheValue != null)
            _videos.push({
                videoId: videoId,
                videoInfo: cacheValue
            });
        else
            _videos.push({
                videoId: videoId,
                videoInfo: {title: '', length: '', views: '', thumbnail: ''}
            });
    });

    return _videos;
}