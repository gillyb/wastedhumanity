$(function () {

    $('#video-url').focus();

    $('#popular-videos .popular-video').each(function (i, elem) {
        var _videoId = $(elem).data('video-id');

        var hasInfo = $(elem).find('.title').text().trim() != '';
        if (hasInfo) {
            var e = $(elem).find('.wasted-time');
            e.html('Humanity wasted too much time on this');
            return;
        }

        $.ajax({
            type: 'post',
            url: '/get-info',
            data: {
                videoId: _videoId,
                useCache: true
            },
            success: function (res) {
                if (!res) {
                    $(elem).find('.title').html('Error retrieving video data...');
                    $(elem).find('.view-movie').remove();
                    return;
                }

                var defaultImg = $(elem).find('.thumbnail').attr('src');
                $(elem).find('.thumbnail')
                    .attr('src', res.thumbnail)
                    .one('error', function () {
                        $(this).attr('src', defaultImg);
                    });
                $(elem).find('.title').html(res.title);

                $(elem).find('.wasted-time').html('Humanity wasted too much time on this');
            },
            error: function (e) {
                $(elem).find('.title').html('Error retrieving video data...');
            }
        });
    });

    var currentVideo = $('#video-results').data('current-video');
    if (currentVideo && currentVideo.trim() != '') {
        $('#video-url').val('http://www.youtube.com/watch?v=' + currentVideo);
        uploadVideo();
    }

    // UPLOAD VIDEO FORM
    $('#check-video').on('click', uploadVideo);

    function uploadVideo() {
        $('#video-results').hide();
        var videoUrl = $('#video-url').val();

        if (videoUrl.trim() == '' || videoUrl.trim() == 'http://')
            return;

        $('#check-video').addClass('loading');
        $('#check-video .label').html('');
        $('#check-video .form-loader').show();

        $.ajax({
            type: 'post',
            url: '/get-info',
            data: {
                videoUrl: videoUrl,
                useCache: false
            },
            success: function (res) {
                if (!res) {
                    $('#error-message').show();
                    $('#video-results').hide();
                    showButton();
                }

                // {id, title, length, views, thumbnail}
                var videoLength = getHours(res.length);
                var views = res.views;
                var timeSpent = views * videoLength;

                var video = $('#video-results');
                video.data('current-video', res.id);
                video.find('.movie-length span').html(getFriendlyDuration(res.length));
                video.find('.movie-count span').html(numberWithCommas(res.views));
                video.find('.wasted-time span').html(friendlyTimeString(timeSpent));
                video.find('.thumbnail').attr('src', res.bigThumbnail);
                video.find('.video-title').html(res.title);

                var yearsSpent = timeSpent / 24 / 365;
                video.find('.fun-fact').html(' ' + getHistoryFact(yearsSpent));

                video.slideDown();
            },
            error: function () {
                $('#error-message').show();
            },
            complete: function () {
                showButton();
            }
        });
    }

    var videoResults = $('#video-results');
    videoResults.on('click', 'img.thumbnail', function () {
        openYoutubeVideo(videoResults.data('current-video'));
    });
    videoResults.on('click', '.video-title', function () {
        openYoutubeVideo(videoResults.data('current-video'));
    });

    videoResults.on('mouseenter', '.thumbnail-container', function () {
        videoResults.find('.overlay').slideDown('fast');
    }).on('mouseleave', '.thumbnail-container', function () {
        videoResults.find('.overlay').slideUp('fast');
    });

    function showButton() {
        $('#check-video').removeClass('loading');
        $('#check-video .label').html('BAM!');
        $('#check-video .form-loader').hide();
    }

    $('#video-url').keyup(function (event) {
        $('#error-message').hide();
        if (event.keyCode == 13)
            uploadVideo();
    });

    var videoInfo = $('.video-info');
    videoInfo.find('.title').on('click', function () {
        showVideo($(this));
    });
    // videoInfo.find('.thumbnail').on('click', function () {
    //     showVideo($(this));
    // });
    // $('.view-movie').on('click', function () {
    //     showVideo($(this));
    // });

    function showVideo(t) {
        var videoId = t.parents('.popular-video').data('video-id');
        var url = 'http://youtube.com/watch?v=' + videoId;
        $('#video-url').val(url);
        uploadVideo();
    }

    $('.about-link').on('click', function () {
        var backdrop = $('<div/>').addClass('about-backdrop');
        backdrop.css({
            'zindex': 990,
            'position': 'fixed',
            'top': 0,
            'left': 0,
            'width': $(window).width(),
            'height': $(window).height(),
            'background-color': '#111',
            'opacity': 0.5
        });
        backdrop.on('click', function () {
            $('.about-backdrop').remove();
            $('.about-modal').remove();
        });
        backdrop.appendTo($('body'));

        $(document).keyup(function (e) {
            if (e.keyCode == 27) { // escape key
                $('.about-backdrop').remove();
                $('.about-modal').remove();
            }
        });

        var dialog = $('<div/>').addClass('about-modal');
        var left = ($(window).width() / 2) - 350;
        var top = ($(window).height() / 2) - 210;
        dialog.css({
            'zindex': 1000,
            'display': 'inline-block',
            'width': 700,
            'height': 405,
            'position': 'fixed',
            'top': top,
            'left': left
        });
        dialog.html($('#about-content').html());
        dialog.appendTo($('body'));
    });

});

function openYoutubeVideo(videoId) {
    var backdrop = $('<div/>').addClass('youtube-player-backdrop');
    backdrop.css({
        'zindex': 990,
        'position': 'fixed',
        'top': 0,
        'left': 0,
        'width': $(window).width(),
        'height': $(window).height(),
        'background-color': '#111',
        'opacity': 0.5
    });
    backdrop.on('click', function () {
        $('.youtube-player-backdrop').remove();
        $('.inner-youtube-player').remove();
    });
    backdrop.appendTo($('body'));

    $(document).keyup(function (e) {
        if (e.keyCode == 27) { // escape key
            $('.youtube-player-backdrop').remove();
            $('.inner-youtube-player').remove();
        }
    });

    var dialog = $('<div/>').addClass('inner-youtube-player');
    var left = ($(window).width() / 2) - 425;
    var top = ($(window).height() / 2) - 240;
    dialog.css({
        'zindex': 1000,
        'display': 'inline-block',
        'width': 560,
        'height': 315,
        'position': 'fixed',
        'top': top,
        'left': left
    });
    dialog.html('<iframe allowfullscreen="" frameborder="0" height="480" src="http://www.youtube.com/embed/' + videoId + '?autoplay=1" width="853"></iframe>');
    dialog.appendTo($('body'));
}

function getHours(duration) {
    var hours = 0;
    var d = duration.substring(2);

    var h = d.split('H');
    if (h.length > 1) {
        hours += parseInt(h[0]);
        d = d.substring(h[0].length + 1);
    }

    var m = d.split('M');
    if (m.length > 1) {
        hours += parseInt(m[0]) / 60;
        d = d.substring(m[0].length + 1);
    }

    var s = d.split('S');
    if (s.length > 1) {
        hours += parseFloat(s[0] / (60 * 60));
    }

    return hours;
}

function getFriendlyDuration(duration) {
    var time = duration.replace('PT', '').replace('H', ':').replace('M', ':').replace('S', '');
    var timeParts = time.split(':');
    var parsedTime = '';
    for (var i = 0; i < timeParts.length; i++)
        parsedTime = parsedTime + ("0" + timeParts[i]).slice(-2) + ':';
    return parsedTime.substring(0, parsedTime.length - 1);
}

function friendlyTimeString(numHours) {
    if (numHours > 8760) // years
        return numberWithCommas(Math.round(numHours / 8760)) + ' years';
    if (numHours > 24) // days
        return numberWithCommas(Math.round(numHours / 24)) + ' days';
    if (numHours > 1)
        return Math.round(numHours) + ' hours';

    return 'less than 1 hour';
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getHistoryFact(numYears) {
    try {
        var shorterEvents = [];
        $.each(_historyFacts, function (index, val) {
            if (val[0] <= numYears)
                shorterEvents.push(val[1]);
        });

        if (shorterEvents.length == 0)
            return null;

        return shorterEvents[Math.floor((Math.random() * 100) % (shorterEvents.length))];
    }
    catch (e) {
        return null;
    }
}

var _historyFacts = [
    [7, 'It only took 4 years to paint the <a href="http://en.wikipedia.org/wiki/Mona_Lisa" target="_blank">Mona Lisa</a>!'],
    [10, 'The <a href="http://en.wikipedia.org/wiki/French_Revolution" target="_blank">French Revolution</a> only lasted 10 years!'],
    [10, 'It only took 10 years to build the <a href="http://en.wikipedia.org/wiki/Colosseum" target="_blank">Colloseum</a> in Rome!'],
    [21, 'It took only 21 years to build the <a href="http://en.wikipedia.org/wiki/Colosseum" target="_blank">Taj Mahal</a> in India!'],
    [17, 'It took 17 years to build the <a href="http://en.wikipedia.org/wiki/Panama_Canal" target="_blank">Panama Canal</a>'],
    [20, 'It took only 20 years to built the <a href="http://en.wikipedia.org/wiki/Great_Pyramid_of_Giza" target="_blank">Great Pyramid of Giza</a>!'],
    [84, '<a href="http://en.wikipedia.org/wiki/DNA" target="_blank">DNA</a> was discovered in 1869, and it took only 84 years to reveal the full structure!'],
    [346, 'The <a href="http://en.wikipedia.org/wiki/British_Empire" target="_blank">British Empire</a> only lasted 346 years!'],
    [623, 'The <a href="http://en.wikipedia.org/wiki/Ottoman_Empire" target="_blank">Ottoman Empire</a> only lasted 623 years!'],
    [4, 'It only took 4 years to paint the <a href="http://en.wikipedia.org/wiki/Sistine_Chapel" target="_blank">Sistine Chapel</a>!'],
    [4, 'It took less than 4 years to build the <a href="http://en.wikipedia.org/wiki/RMS_Titanic" target="_blank">Titanic</a>!'],
    [6, '<a href="http://en.wikipedia.org/wiki/World_War_II" target="_blank">World War II</a> only lasted 6 years!'],
    [2, 'It only took 2 years to build the <a href="http://en.wikipedia.org/wiki/Eiffel_Tower" target="_blank">Eiffel Tower</a>'],
    [2, 'It took 2 years to build the <a href="http://en.wikipedia.org/wiki/Empire_State_Building" target="_blank">Empire State Building</a>'],
    [5, 'It only took 5 years to discover the <a href="http://en.wikipedia.org/wiki/Polio_vaccine" target="_blank">Polio Vaccine</a>']
];