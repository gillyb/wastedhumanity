const request = require('request');
const Promise = require('bluebird');


var youtubeApiKey = 'AIzaSyA0xWbm5Q7SF5aFZQJ8EGmb6fNc8cjQEwg';

var _getVideoId = function (url) {

    var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
    if (videoid != null) {
        if (videoid.indexOf('v=') > -1) {
            console.log('fixing youtube id');
            console.log(videoid.substr(2));
            return videoid.substr(2);
        }

        return videoid[1];
    }

    return null;
};

var _getTrendingVideos = (numResults) => {

    return new Promise((resolve, reject) => {
        request({
            uri: 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,snippet&chart=mostPopular&key=' + youtubeApiKey + '&maxResults=' + numResults,
            method: 'GET',
            json: true
        }, (err, response, body) => {

            if (err || response.statusCode !== 200) {
                reject();
                return;
            }
            let videos = body.items.map((video) => extractVideoData(video));
            resolve(videos);

        });
    });

};

var _getVideoInfo = function (videoId, callback) {

    console.log('making request to youtube video api');

    request({
        uri: 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,snippet&id=' + videoId + '&key=' + youtubeApiKey,
        method: 'GET',
        json: true
    }, (err, response, body) => {
        if (err) {
            console.log('Error while fetching youtube video data');
            callback(null);
        }

        try {
            var videoData = extractVideoData(body.items[0]);
            callback(videoData);
        }
        catch (e) {
            console.log('error extracting video data. Error: ' + e);
            callback(null);
        }
    });
};

function extractVideoData(videoObj) {
    var videoId = videoObj['id'];
    var videoName = videoObj['snippet']['title'];
    var videoLength = videoObj['contentDetails']['duration'];
    var videoViewCount = videoObj['statistics']['viewCount'];
    var videoDefaultThumbnail = videoObj['snippet']['thumbnails']['default']['url'];
    var videoMediumThumbnail = videoObj['snippet']['thumbnails']['medium']['url'];

    return {
        id: videoId,
        title: videoName.replace('\'', '\\\'').replace('"', '\"'),
        length: videoLength.replace('\'', '\\\'').replace('"', '\"'),
        views: videoViewCount.replace('\'', '\\\'').replace('"', '\"'),
        thumbnail: videoDefaultThumbnail.replace('\'', '\\\'').replace('"', '\"'),
        bigThumbnail: videoMediumThumbnail.replace('\'', '\\\'').replace('"', '\"')
    };
}

exports.getVideoId = _getVideoId;
exports.getVideoInfo = _getVideoInfo;
exports.getTrendingVideos = _getTrendingVideos;