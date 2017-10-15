const youtubeProvider = require('./../youTubeProvider');
const cacheProvider = require('./../cacheProvider');
const videoRepo = require('./../videoRepository');

// TODO: move this to product repo!!!
const products = [
    {
        url: 'http://amzn.to/2kRsxLL',
        img: 'https://images-na.ssl-images-amazon.com/images/I/71STvIccd3L._SY679_.jpg',
        name: 'A HUGE barrel of lube',
        description: 'When you\'re a porn star, this is the only way to survive'
    },
    {
        url: 'http://amzn.to/2zq2IWo',
        img: 'https://images-na.ssl-images-amazon.com/images/I/71KpZCBa%2BZL._SX522_.jpg',
        name: 'Poop face emoji cuddle pillow',
        description: 'You want to cuddle, but no one really wants to cuddle with you.. Then this is for you!'
    },
    {
        url: 'http://amzn.to/2zbTOLc',
        img: 'https://images-na.ssl-images-amazon.com/images/I/71Op%2B%2BqqszL._UX679_.jpg',
        name: 'Brief 3d animal panties',
        description: '...'
    },
    {
        url: 'http://amzn.to/2xHt4B9',
        img: 'https://images-na.ssl-images-amazon.com/images/I/81mixtNS-BL._SY679_.jpg',
        name: 'Infant mermaid costume',
        description: 'Just looking at the image of this ridiculous baby costume, made me laugh out loud.'
    },
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

var defaultPageTitle = 'The time humanity wasted on nonsense';

app.get('/', function (req, res) {

    Promise.all([
        youtubeProvider.getTrendingVideos(10),
        youtubeProvider.getHomePageVideos(videoRepo.favoriteVideos)
    ]).then((results) => {

        res.render('homepage', {
            trendingVideos: results[0],
            allTimePopularVideos: results[1],
            currentVideo: null,
            products: products,
            pageTitle: defaultPageTitle
        });

    });

});

app.get('/:videoId', (req, res) => {
    var videoId = req.params.videoId;

    Promise.all([
        youtubeProvider.getTrendingVideos(10),
        youtubeProvider.getHomePageVideos(videoRepo.favoriteVideos)
    ]).then((results) => {

        res.render('homepage', {
            trendingVideos: results[0],
            allTimePopularVideos: results[1],
            currentVideo: videoId,
            products: products,
            pageTitle: defaultPageTitle
        });

    });

});
app.get('/:videoId/:videoName', (req, res) => {
    var videoId = req.params.videoId;

    Promise.all([
        youtubeProvider.getTrendingVideos(10),
        youtubeProvider.getHomePageVideos(videoRepo.favoriteVideos)
    ]).then((results) => {

        res.render('homepage', {
            trendingVideos: results[0],
            allTimePopularVideos: results[1],
            currentVideo: videoId,
            products: products,
            pageTitle: req.params.videoName
        });

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
    youtubeProvider.getVideoInfo(videoId).then((videoInfo) => {
        if (useCache)
            cacheProvider.put(videoId, videoInfo, 3);
        res.json(videoInfo);
        return;
    }).catch(() => {
        res.json({error: 'error getting video info'});
        return;
    });

});