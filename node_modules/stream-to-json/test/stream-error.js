var through = require('through');
var test = require('tape');
var toJSON = require('..');

test('stream error', function(t) {
  t.plan(2);
  var stream = through();
  
  toJSON(stream, function(err) {
    t.ok(err);
    t.equal(err.message, 'stream error');
  });
  
  stream.emit('error', new Error('stream error'));
});
