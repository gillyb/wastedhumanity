const request = require('request');
const Promise = require('bluebird');
const utils = require('./utils');
const videoRepo = require('./videoRepository');
const cacheProvider = require('./cacheProvider');

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

// Gets currently trending youtube videos
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

// Gets the video info from cache.
// If not in cache, fetches from youtube api
var _getVideoInfo = function (videoId) {

    let videoInfo = cacheProvider.get(videoId);
    if (videoInfo) {
        // refresh cache for another 10 minutes
        cacheProvider.put(videoId, videoInfo, 10);
        return Promise.resolve(videoInfo);
    }

    return new Promise((resolve, reject) => {
        console.log('making request to youtube video api');
        request({
            uri: 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,snippet&id=' + videoId + '&key=' + youtubeApiKey,
            method: 'GET',
            json: true
        }, (err, response, body) => {
            if (err) {
                console.log('Error while fetching youtube video data');
                reject();
                return;
            }

            try {
                var videoData = extractVideoData(body.items[0]);
                cacheProvider.put(videoId, videoData, 10);       // cache for 10 minutes
                resolve(videoData);
                return;
            }
            catch (e) {
                console.log('error extracting video data. Error: ' + e);
                reject();
                return;
            }
        });
    });
};

function extractVideoData(videoObj) {
    let videoId = videoObj['id'];
    let videoName = videoObj['snippet']['title'];
    let videoLength = videoObj['contentDetails']['duration'];
    let videoViewCount = videoObj['statistics']['viewCount'];
    let videoDefaultThumbnail = videoObj['snippet']['thumbnails']['default']['url'];
    let videoMediumThumbnail = videoObj['snippet']['thumbnails']['medium']['url'];

    return {
        id: videoId,
        title: videoName.replace('\'', '\\\'').replace('"', '\"'),
        urlTitle: utils.getSlug(videoName),
        length: videoLength.replace('\'', '\\\'').replace('"', '\"'),
        views: videoViewCount ? videoViewCount.replace('\'', '\\\'').replace('"', '\"') : 856,
        thumbnail: videoDefaultThumbnail.replace('\'', '\\\'').replace('"', '\"'),
        bigThumbnail: videoMediumThumbnail.replace('\'', '\\\'').replace('"', '\"')
    };
}

function _getHomePageVideos(videoIds) {
    return Promise.map(videoIds, function(videoId) {
        return _getVideoInfo(videoId);
    });
}

exports.getVideoId = _getVideoId;
exports.getVideoInfo = _getVideoInfo;
exports.getTrendingVideos = _getTrendingVideos;
exports.getHomePageVideos = _getHomePageVideos;
