
// the cache dictionary should look like this :
// {
// 	 'cache_key': {
//     'val': { cache_value },
//     'expire': expiration_timestamp
//   }
// }

var cache = {};

var _get = function(key) {
	if (cache.hasOwnProperty(key)) {
		if (cache[key].expire < now())
			return null;

		return cache[key].val;
	}

	return null;
};

var _put = function(key, value, expire) {
	var expiration = now() + (expire * 60 * 1000);
	cache[key] = {
		'val': value,
		'expire': expiration
	};
};

var _clear = function() {
	cache = {};
};

function now() {
	return (new Date()).getTime();
}

exports.get = _get;
exports.put = _put;
exports.clear = _clear;