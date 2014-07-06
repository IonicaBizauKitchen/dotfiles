(function() {
  var Fs, Path, emoji, emojiFolder, marked, taskLists;

  Fs = require('fs');

  Path = require('path');

  marked = require('marked');

  emoji = require('emoji-images');

  taskLists = require('task-lists');

  emojiFolder = Path.join(Path.dirname(require.resolve('emoji-images')), "pngs");

  module.exports = function(file, opts, callback) {
    var conversion, key, options,
      _this = this;
    options = {
      isFile: false,
      header: '<h<%= level %>><a name="<%= anchor %>" class="anchor" href="#<%= anchor %>"><span class="octicon octicon-link"></span></a><%= header %></h<%= level %>>',
      anchorMin: 1
    };
    conversion = function(data) {
      var contents, emojified, mdToHtml;
      emojified = emoji(data, emojiFolder, 20).replace(/\\</g, "&lt;");
      mdToHtml = marked(emojified);
      return contents = taskLists(mdToHtml);
    };
    if (typeof opts === 'function') {
      callback = opts;
    } else {
      for (key in opts) {
        options[key] = opts[key];
      }
    }
    marked.setOptions(options);
    if (options.isFile) {
      return Fs.readFile(file, "utf8", function(err, data) {
        if (err) {
          return callback(err, null);
        } else {
          return callback(null, conversion(data));
        }
      });
    } else {
      return callback(null, conversion(file));
    }
  };

}).call(this);
