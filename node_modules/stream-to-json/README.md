
# stream-to-json

  Deserialize JSON from a stream

  [![build status](https://secure.travis-ci.org/juliangruber/stream-to-json.png)](http://travis-ci.org/juliangruber/stream-to-json)

  [![testling badge](https://ci.testling.com/juliangruber/stream-to-json.png)](https://ci.testling.com/juliangruber/stream-to-json)

## Example

```js
var toJSON = require('stream-to-json');
var request = require('request');

toJSON(request('/some/url.json'), function(err, json) {
  if (err) throw err;
  console.log(json);
});
```

## API

### toJSON(stream, fn)

Read all from `stream`, then `JSON.parse` and call `fn` with the result.
If there's an Error in the stream itself, or parsing the JSON, an error
will be passed.

## Installation

```bash
$ npm install stream-to-json
```

## License

  MIT
