const youtubeProvider = require('./../youTubeProvider');
const cacheProvider = require('./../cacheProvider');

const popularVideos = ['9bZkp7q19f0', 'kffacxfA7G4', 'fWNaR-rxAic', 'QK8mJJJvaes', 'KQ6zr6kCPj8', 'qrO4YZeyl0I'];
const favoriteVideos = ['QH2-TGUlwu4', 'jofNR_WkoCE', 'uVTfszppJl8', 'nlt5Wa13fFU', 'EIyixC9NsLI', 'Lf2db4hD6zI',
    'cYNdUM2gRsg', 'VCEsveSK5to', 'IDtdQ8bTvRc', '2Tvy_Pbe5NA', 'K7l5ZeVVoCA', 'xfeys7Jfnx8',
    'khCokQt--l4', 'xDj7gvc_dsA', 'nZcRU0Op5P4', 'lVmmYMwFj1I'];

const products = [
    {
        url: 'http://amzn.to/2hn2w5v',
        img: 'https://images-na.ssl-images-amazon.com/images/I/31VTJj4VuVL.jpg',
        name: 'Banana Slicer',
        description: 'You have got to read the reviews of this product, they made me laugh out loud so many times!!!'
    },
    {
        url: 'http://amzn.to/2u3D6Qb',
        img: 'https://images-na.ssl-images-amazon.com/images/I/416-PAZ370L._SX384_BO1,204,203,200_.jpg',
        name: 'A million random digits',
        description: 'If you\'re ever too lazy to throw a dice...'
    },
    {
        url: 'http://amzn.to/2vilO1C',
        img: 'https://images-na.ssl-images-amazon.com/images/I/41CI7Ji0qbL.jpg',
        name: 'The easy button',
        description: 'A classic. When it\'s just too damn hard to say that it\'s easy'
    },
    {
        url: 'http://amzn.to/2uYBTqK',
        img: 'https://images-na.ssl-images-amazon.com/images/I/512slp93A4L._SX331_BO1,204,203,200_.jpg',
        name: 'How to talk to your cat about Gun Safety',
        description: 'A MUST-HAVE for any cat owner!!!'
    },
    {
        url: 'http://amzn.to/2f7I7AN',
        img: 'https://images-na.ssl-images-amazon.com/images/I/61wRZzNAjVL._SX522_.jpg',
        name: 'Dick trophy',
        description: 'Probably your best friend\'s best friend.'
    },
    {
        url: 'http://amzn.to/2wlgmIh',
        img: 'https://images-na.ssl-images-amazon.com/images/I/51rXj4BnhGL._SX453_BO1,204,203,200_.jpg',
        name: 'Dancing with Jesus',
        description: 'Because you just know he got the moves like Jagger'
    },
    {
        url: 'http://amzn.to/2w5wNsG',
        img: 'https://images-na.ssl-images-amazon.com/images/I/51BRARosdqL.jpg',
        name: 'TMNT Rafael Dog Costume',
        description: 'Cowabunga!!!!!!!!!!!1'
    },
    {
        url: 'http://amzn.to/2uZbsRz',
        img: 'https://images-na.ssl-images-amazon.com/images/I/51PKrGEerwL._SL1001_.jpg',
        name: 'Vladimir Putin on a bear action figure',
        description: 'Does this really require a logical explanation?! Just buy it already!!'
    },
    {
        url: 'http://amzn.to/2uZq1Vg',
        img: 'https://images-na.ssl-images-amazon.com/images/I/41NGgzbfwJL.jpg',
        name: 'The Semen Bartender\'s Handbook',
        description: 'Have you ever tried making a semen based cocktail on your own? If so, then you\'re crazy! You should have bought this book first.'
    },
    {
        url: 'http://amzn.to/2vtRaD1',
        img: 'https://images-na.ssl-images-amazon.com/images/I/81IreLXvTQL._SX522_.jpg',
        name: 'Emoji poop 3 piece bed sheet',
        description: 'When you\'re getting ready for the first time a romantic date is coming to sleep over...'
    },
    {
        url: 'http://amzn.to/2hns4iK',
        img: 'https://images-na.ssl-images-amazon.com/images/I/41zcCTQxZJL.jpg',
        name: 'Bag of dicks',
        description: 'Literally. A Bag of dicks. Well, gummy dicks, but still dicks.'
    },
    {
        url: 'http://amzn.to/2w6W4Tm',
        img: 'https://images-na.ssl-images-amazon.com/images/I/61Jt%2BxZeYVL._SL1000_.jpg',
        name: 'Donald Trump chia head',
        description: 'Nuf\' said'
    },
    {
        url: 'http://amzn.to/2w6A6jp',
        img: 'https://images-na.ssl-images-amazon.com/images/I/31hxKkgG5pL.jpg',
        name: 'Charles Manson cardboard cutout',
        description: 'I seriously cant imagine anyone actually buying this, but it\'s for sale, so I guess someone did.'
    }
];

app.get('/', function (req, res) {
    // youtubeProvider.getTrendingVideos(10).then((trendingVideos) => {

	res.render('homepage', {
		videos: getHomePageVideos(popularVideos),
		favoriteVideos: getHomePageVideos(favoriteVideos),
		currentVideo: null,
        products: products
	});

});

app.get('/:videoId', (req, res) => {
    var videoId = req.params.videoId;
    res.render('homepage', {
        videos: getHomePageVideos(popularVideos),
        favoriteVideos: getHomePageVideos(favoriteVideos),
        currentVideo: videoId,
        products: products
    });
});
app.get('/:videoId/:videoName', (req, res) => {
    var videoId = req.params.videoId;
    res.render('homepage', {
        videos: getHomePageVideos(popularVideos),
        favoriteVideos: getHomePageVideos(favoriteVideos),
        currentVideo: videoId,
        products: products
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
                videoInfo: { title: '', length: '', views: '', thumbnail: '' }
            });
    });

    return _videos;
}