var concat = require('concat-stream');
var once = require('once');

module.exports = toJSON;

/**
 * Stream to JSON.
 *
 * @param {Stream} stream
 * @param {Function} fn
 */

function toJSON(stream, fn) {
  fn = once(fn);
  stream.on('error', fn);
  stream.pipe(concat(function(raw) {
    if (Array.isArray(raw)) {
      raw = raw.map(function(r) {
        return r.toString();
      }).join('');
    }
    if (typeof raw != 'string') raw = raw.toString();
    try {
      var json = JSON.parse(raw);
    } catch (err) {
      fn(err);
    }
    fn(null, json);
  }));
}
