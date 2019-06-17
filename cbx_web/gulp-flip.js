// JSON text flipper: In order to make it easier to identify untranslated strings in the HMI,
// this file generates a "language" that's the English strings flipped upside down.
//
// Flipped text looks like this:
// sᴉɥʇ ǝʞᴉl sʞool ʇxǝʇ pǝddᴉlℲ

var through = require('through2');
var gutil = require('gulp-util');
var flip = require('flip-text');
var PluginError = gutil.PluginError;

var PLUGIN_NAME = "gulp-flip";

function flipString(string) {
  var bracketLevel = 0;
  // Don't flip text in curly brackets, because that's used for substitution
  var tokens = string.split(/([{}])/)
  tokens = tokens.map(function(token) {
    if (token === '') {
      // no-op. Occurs between consecutive brackets.
      return token;
    }
    else if (token === '{') {
      bracketLevel++;
      // switch open & close, because we're reversing the order of the tokens
      return '}';
    }
    else if (token === '}') {
      bracketLevel--;
      return '{';
    }
    else {
      if (bracketLevel === 0) {
        return flip(token);
      }
      else {
        return token;
      }
    }
  })

  return tokens.reverse().join('');
}

function flipJson(root) {
  for (var key in root) {
    if (root.hasOwnProperty(key)) {
      var value = root[key];
      if (typeof value === 'object') {
        root[key] = flipJson(value);
      }
      else if (typeof value === 'string') {
        root[key] = flipString(value);
      }
    }
  }

  return root;
}

function testFlip() {
  var data = {
    x: "Hello, world",
    y: "Thing ({{units}})",
    z: {
      a: "One",
      b: "Two",
    }
  };

  var flipped = flipJson(data);
  return flipped;
}

function textFlipper() {
  var stream = through.obj(function(file, enc, cb) {
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported'));
      return cb();
    }

    var jsonText = file.contents;
    var json = JSON.parse(jsonText);
    var flippedJson = flipJson(json);
    file.contents = new Buffer(JSON.stringify(flippedJson, null, 2));

    this.push(file);
    cb();
  })
  return stream;
}

module.exports = textFlipper;
// for debugging
module.exports.flipString = flipString;
module.exports.flipJson = flipJson;
module.exports.testFlip = testFlip;
