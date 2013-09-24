
$(function() {

	$('#popular-videos .popular-video').each(function(i, elem) {
		var url = $(elem).data('video-url');
		$.ajax({
			type: 'post',
			url: '/get-info',
			data: {videoUrl: url},
			success: function(res) {
				$(elem).find('.thumbnail').attr('src', res.thumbnail);
				$(elem).find('.title').html(res.title);

				var timeSpent = res.views * getHours(res.length);
				$(elem).append('Wasted ' + friendlyTimeString(timeSpent) + ' on this video');
			},
			error: function(e) {
				$(elem).find('.title').html('Error retrieving video data...');
			}
		});
	});

	// UPLOAD VIDEO FORM
	$('#check-video').on('click', uploadVideo);

	function uploadVideo() {
		$('#check-video').addClass('loading');
		$('#check-video .label').html('');
		$('#check-video .form-loader').show();

		var videoUrl = $('#video-url').val();
		$.ajax({
			type: 'post',
			url: '/get-info',
			data: { videoUrl: videoUrl },
			success: function(res) {
				// {title, length, views, thumbnail}
				var videoLength = getHours(res.length);
				var views = res.views;
				var timeSpent = views * videoLength;

				var video = $('#video-results');
				video.find('.movie-length span').html(getFriendlyDuration(res.length));
				video.find('.movie-count span').html(numberWithCommas(res.views));
				video.find('.wasted-time span').html(friendlyTimeString(timeSpent));
				video.find('.thumbnail').attr('src', res.thumbnail);
				video.find('.title').html(res.title);

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
	    if (event.keyCode == 13) {
	        uploadVideo();
	    }
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
			hours += parseInt(s[0] / (60 * 60));
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

});