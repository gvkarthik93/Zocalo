var through = require('through');
var test = require('tape');
var toJSON = require('..');

test('buffer', function(t) {
  t.plan(2);
  var stream = through();
  
  toJSON(stream, function(err, json) {
    t.error(err);
    t.deepEqual(json, { foo: 'bar' });
  });
  
  stream.queue(new Buffer('{"foo'));
  stream.queue(new Buffer('":"bar"}'));
  stream.queue(null);
});
