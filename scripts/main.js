
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
				$(elem).append('Wasted ' + timeSpent + ' hours on this video');
			},
			error: function(e) {

			}
		});
	});

	$('#check-video').on('click', function() {
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
				video.find('.thumbnail').attr('src', res.thumbnail);
				video.find('.title').html(res.title);

				video.slideDown();

				$('#video-result').text('Humanity has spent ' + timeSpent + ' hours watching this stupid shit!');
			},
			error: function() {

			}
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
			hours += parseInt(s[0] / (60 * 60));
		}

		return hours;
	}

	function friendlyTimeString(numHours) {
		if (numHours > 8760) // years
			return Math.round(numHours / 8760) + ' years';
		if (numHours > 24) // days
			return Math.round(numHours / 24) + ' days';
		return Math.round(numHours) + ' hours';
	}

});