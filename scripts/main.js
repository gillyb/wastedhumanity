
$(function() {

	$('#video-url').val('http://').focus();

	$('#popular-videos .popular-video').each(function(i, elem) {
		var _videoId = $(elem).data('video-id');

		var hasInfo = $(elem).find('.title').text().trim() != '';
		if (hasInfo) {
			var e = $(elem).find('.wasted-time');
			var timeSpent = e.data('views') * getHours(e.data('length'));
			e.html('Humanity wasted <span class="value">' + friendlyTimeString(timeSpent) + '</span> watching this!');
			return;
		}

		console.log('making ajax request');
		$.ajax({
			type: 'post',
			url: '/get-info',
			data: {videoId: _videoId},
			success: function(res) {
				if (!res) {
					$(elem).find('.title').html('Error retrieving video data...');
					$(elem).find('.view-movie').remove();
					return;
				}

				var defaultImg = $(elem).find('.thumbnail').attr('src');
				$(elem).find('.thumbnail')
					.attr('src', res.thumbnail)
					.one('error', function() {
						$(this).attr('src', defaultImg);
					});
				$(elem).find('.title').html(res.title);

				var timeSpent = res.views * getHours(res.length);
				$(elem).find('.wasted-time').html('Humanity wasted <span class="value">' + friendlyTimeString(timeSpent) + '</span> watching this!');
			},
			error: function(e) {
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
		var videoUrl = $('#video-url').val();
		
		if (videoUrl.trim() == '' || videoUrl.trim() == 'http://')
			return;

		$('#check-video').addClass('loading');
		$('#check-video .label').html('');
		$('#check-video .form-loader').show();

		$.ajax({
			type: 'post',
			url: '/get-info',
			data: { videoUrl: videoUrl },
			success: function(res) {
				if (!res) return;
				
				// {title, length, views, thumbnail}
				var videoLength = getHours(res.length);
				var views = res.views;
				var timeSpent = views * videoLength;

				var video = $('#video-results');
				video.find('.movie-length span').html(getFriendlyDuration(res.length));
				video.find('.movie-count span').html(numberWithCommas(res.views));
				video.find('.wasted-time span').html(friendlyTimeString(timeSpent));
				video.find('.thumbnail').attr('src', res.thumbnail);
				video.find('.video-title').html(res.title);
				video.find('.fun-fact').html(' ' + getHistoryFact(timeSpent));

				video.slideDown();
			},
			error: function() {
				
			},
			complete: function() {
				$('#check-video').removeClass('loading');
				$('#check-video .label').html('BAM!');
				$('#check-video .form-loader').hide();
			}
		});
	}

	$('#video-url').keyup(function(event) {
		// fix double 'http://' in url
		if ($(this).val().indexOf('http://http://') == 0)
			$(this).val($(this).val().substring(7));

	    if (event.keyCode == 13) {
	        uploadVideo();
	    }
	});

	$('.view-movie').on('click', function() {
		var videoId = $(this).parents('.popular-video').data('video-id');
		var url = 'http://www.youtube.com/watch?v=' + videoId;
		window.open(url, 'youtube_video');
	});
	
});

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
	return duration.replace('PT', '').replace('H', ':').replace('M', ':').replace('S', '');
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
		_historyFacts.forEach(function(val) {
			if (val[0] <= numYears)
				shorterEvents.push(val[1]);
		});

		if (shorterEvents.length == 0)
			return null;

		return shorterEvents[Math.floor((Math.random() * 100) % (shorterEvents.length + 1))];
	}
	catch (e) {
		return null;
	}
}

var _historyFacts = [
	[4, 'It only took 4 years to paint the <a href="http://en.wikipedia.org/wiki/Mona_Lisa" target="_blank">Mona Lisa</a>!'],
	[10, 'The <a href="http://en.wikipedia.org/wiki/French_Revolution" target="_blank">French Revolution</a> only lasted 10 years!'],
	[10, 'It only took 10 years to build the <a href="http://en.wikipedia.org/wiki/Colosseum" target="_blank">Colloseum</a> in Rome!'],
	[21, 'It took only 21 years to build the <a href="http://en.wikipedia.org/wiki/Colosseum" target="_blank">Taj Mahal</a> in India!'],
	[17, 'It took 17 years to build the <a href="http://en.wikipedia.org/wiki/Panama_Canal" target="_blank">Panama Canal</a>'],
	[20, 'It took only 20 years to built the <a href="http://en.wikipedia.org/wiki/Great_Pyramid_of_Giza" target="_blank">Great Pyramid of Giza</a>!'],
	[84, '<a href="http://en.wikipedia.org/wiki/DNA" target="_blank">DNA</a> was discovered in 1869, and it took only 84 years to reveal the full structure!'],
	[346, 'The <a href="http://en.wikipedia.org/wiki/British_Empire" target="_blank">British Empire</a> only lasted 346 years!'],
	[623, 'The <a href="http://en.wikipedia.org/wiki/Ottoman_Empire" target="_blank">Ottoman Empire</a> only lasted 623 years!'],
	[4, 'It only took 4 years to paint the <a href="http://en.wikipedia.org/wiki/Sistine_Chapel" target="_blank">Sistine Chapel</a>!']	,
	[4, 'It took less than 4 years to build the <a href="http://en.wikipedia.org/wiki/RMS_Titanic" target="_blank">Titanic</a>!'],
	[6, '<a href="http://en.wikipedia.org/wiki/World_War_II" target="_blank">World War II</a> only lasted 6 years!'],
	[2, 'It only took 2 years to build the <a href="http://en.wikipedia.org/wiki/Eiffel_Tower" target="_blank">Eiffel Tower</a>'],
	[2, 'It took 2 years to build the <a href="http://en.wikipedia.org/wiki/Empire_State_Building" target="_blank">Empire State Building</a>'],
	[5, 'It only took 5 years to discover the <a href="http://en.wikipedia.org/wiki/Polio_vaccine" target="_blank">Polio Vaccine</a>']
];