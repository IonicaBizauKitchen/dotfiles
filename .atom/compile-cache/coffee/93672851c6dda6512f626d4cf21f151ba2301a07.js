(function() {
  var HeaderView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  module.exports = HeaderView = (function(_super) {
    __extends(HeaderView, _super);

    function HeaderView() {
      return HeaderView.__super__.constructor.apply(this, arguments);
    }

    HeaderView.content = function() {
      return this.div({
        "class": 'panel-heading padded heading headerView'
      }, (function(_this) {
        return function() {
          _this.span({
            "class": 'heading-title',
            outlet: 'title'
          });
          _this.span({
            "class": 'heading-status',
            outlet: 'status'
          });
          return _this.span({
            "class": 'heading-close icon-remove-close pull-right',
            outlet: 'closeButton',
            click: 'close'
          });
        };
      })(this));
    };

    HeaderView.prototype.close = function() {
      return atom.workspaceView.trigger("script:close-view");
    };

    HeaderView.prototype.setStatus = function(status) {
      this.status.removeClass('icon-alert icon-check icon-hourglass icon-stop');
      switch (status) {
        case "start":
          return this.status.addClass('icon-hourglass');
        case "stop":
          return this.status.addClass('icon-check');
        case "kill":
          return this.status.addClass('icon-stop');
        case "err":
          return this.status.addClass('icon-alert');
      }
    };

    return HeaderView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLGlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHlDQUFQO09BQUwsRUFBdUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNyRCxVQUFBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxZQUFBLE9BQUEsRUFBTyxlQUFQO0FBQUEsWUFBd0IsTUFBQSxFQUFRLE9BQWhDO1dBQU4sQ0FBQSxDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsWUFBQSxPQUFBLEVBQU8sZ0JBQVA7QUFBQSxZQUF5QixNQUFBLEVBQVEsUUFBakM7V0FBTixDQURBLENBQUE7aUJBRUEsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLFlBQUEsT0FBQSxFQUFPLDRDQUFQO0FBQUEsWUFBcUQsTUFBQSxFQUFRLGFBQTdEO0FBQUEsWUFBNEUsS0FBQSxFQUFPLE9BQW5GO1dBQU4sRUFIcUQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2RCxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLHlCQU1BLEtBQUEsR0FBTyxTQUFBLEdBQUE7YUFDTCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLG1CQUEzQixFQURLO0lBQUEsQ0FOUCxDQUFBOztBQUFBLHlCQVNBLFNBQUEsR0FBVyxTQUFDLE1BQUQsR0FBQTtBQUNULE1BQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLENBQW9CLGdEQUFwQixDQUFBLENBQUE7QUFDQSxjQUFPLE1BQVA7QUFBQSxhQUNPLE9BRFA7aUJBQ29CLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixnQkFBakIsRUFEcEI7QUFBQSxhQUVPLE1BRlA7aUJBRW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixZQUFqQixFQUZuQjtBQUFBLGFBR08sTUFIUDtpQkFHbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLENBQWlCLFdBQWpCLEVBSG5CO0FBQUEsYUFJTyxLQUpQO2lCQUlrQixJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsQ0FBaUIsWUFBakIsRUFKbEI7QUFBQSxPQUZTO0lBQUEsQ0FUWCxDQUFBOztzQkFBQTs7S0FGdUIsS0FIekIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/zeke/.atom/packages/script/lib/header-view.coffee