var through = require('through');
var test = require('tape');
var toJSON = require('..');

test('json error', function(t) {
  t.plan(1);
  var stream = through();
  
  toJSON(stream, function(err) {
    t.ok(err);
  });
  
  stream.queue('foo');
  stream.queue(null);
});
