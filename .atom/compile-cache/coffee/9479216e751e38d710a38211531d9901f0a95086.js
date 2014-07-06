(function() {
  var NpmDocsView, ScrollView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ScrollView = require('atom').ScrollView;

  module.exports = NpmDocsView = (function(_super) {
    __extends(NpmDocsView, _super);

    atom.deserializers.add(NpmDocsView);

    NpmDocsView.deserialize = function(_arg) {
      var path;
      path = _arg.path;
      return new NpmDocsView(path);
    };

    NpmDocsView.content = function() {
      return this.div({
        "class": 'npm-docs native-key-bindings',
        tabindex: -1
      });
    };

    function NpmDocsView(path) {
      this.path = path;
      NpmDocsView.__super__.constructor.apply(this, arguments);
      this.handleEvents();
    }

    NpmDocsView.prototype.renderContents = function(html) {
      return this.html(html);
    };

    NpmDocsView.prototype.serialize = function() {
      return {
        deserializer: 'NpmDocsView',
        path: this.path
      };
    };

    NpmDocsView.prototype.handleEvents = function() {
      this.subscribe(this, 'core:move-up', (function(_this) {
        return function() {
          return _this.scrollUp();
        };
      })(this));
      return this.subscribe(this, 'core:move-down', (function(_this) {
        return function() {
          return _this.scrollDown();
        };
      })(this));
    };

    NpmDocsView.prototype.destroy = function() {
      return this.unsubscribe();
    };

    NpmDocsView.prototype.getTitle = function() {
      return "npm-docs: " + this.path;
    };

    return NpmDocsView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGtDQUFBLENBQUE7O0FBQUEsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQW5CLENBQXVCLFdBQXZCLENBQUEsQ0FBQTs7QUFBQSxJQUVBLFdBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxJQUFELEdBQUE7QUFDWixVQUFBLElBQUE7QUFBQSxNQURjLE9BQUQsS0FBQyxJQUNkLENBQUE7YUFBSSxJQUFBLFdBQUEsQ0FBWSxJQUFaLEVBRFE7SUFBQSxDQUZkLENBQUE7O0FBQUEsSUFLQSxXQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyw4QkFBUDtBQUFBLFFBQXVDLFFBQUEsRUFBVSxDQUFBLENBQWpEO09BQUwsRUFEUTtJQUFBLENBTFYsQ0FBQTs7QUFRYSxJQUFBLHFCQUFFLElBQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLE9BQUEsSUFDYixDQUFBO0FBQUEsTUFBQSw4Q0FBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQURBLENBRFc7SUFBQSxDQVJiOztBQUFBLDBCQVlBLGNBQUEsR0FBZ0IsU0FBQyxJQUFELEdBQUE7YUFDZCxJQUFDLENBQUEsSUFBRCxDQUFNLElBQU4sRUFEYztJQUFBLENBWmhCLENBQUE7O0FBQUEsMEJBZUEsU0FBQSxHQUFXLFNBQUEsR0FBQTthQUNUO0FBQUEsUUFBQSxZQUFBLEVBQWMsYUFBZDtBQUFBLFFBQ0EsSUFBQSxFQUFNLElBQUMsQ0FBQSxJQURQO1FBRFM7SUFBQSxDQWZYLENBQUE7O0FBQUEsMEJBbUJBLFlBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixNQUFBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBWCxFQUFpQixjQUFqQixFQUFtQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxRQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5DLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBWCxFQUFpQixnQkFBakIsRUFBbUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsVUFBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQyxFQUZZO0lBQUEsQ0FuQmQsQ0FBQTs7QUFBQSwwQkF3QkEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxXQUFELENBQUEsRUFETztJQUFBLENBeEJULENBQUE7O0FBQUEsMEJBMkJBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFDUCxZQUFBLEdBQVcsSUFBQyxDQUFBLEtBREw7SUFBQSxDQTNCVixDQUFBOzt1QkFBQTs7S0FEd0IsV0FIMUIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/zeke/.atom/packages/npm-docs/lib/npm-docs-view.coffee