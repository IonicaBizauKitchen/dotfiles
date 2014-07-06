(function() {
  var ScriptOptionsView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  module.exports = ScriptOptionsView = (function(_super) {
    __extends(ScriptOptionsView, _super);

    function ScriptOptionsView() {
      return ScriptOptionsView.__super__.constructor.apply(this, arguments);
    }

    ScriptOptionsView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.div({
            "class": 'overlay from-top panel',
            outlet: 'scriptOptionsView'
          }, function() {
            _this.div({
              "class": 'panel-heading'
            }, 'Configure Run Options');
            return _this.div({
              "class": 'panel-body padded'
            }, function() {
              _this.div({
                "class": 'block'
              }, function() {
                _this.label('Current Working Directory:');
                return _this.input({
                  type: 'text',
                  "class": 'editor mini editor-colors native-key-bindings',
                  outlet: 'inputCwd'
                });
              });
              _this.div({
                "class": 'block'
              }, function() {
                _this.label('Command');
                return _this.input({
                  type: 'text',
                  "class": 'editor mini editor-colors native-key-bindings',
                  outlet: 'inputCommand'
                });
              });
              _this.div({
                "class": 'block'
              }, function() {
                _this.label('Command Arguments:');
                return _this.input({
                  type: 'text',
                  "class": 'editor mini editor-colors native-key-bindings',
                  outlet: 'inputCommandArgs'
                });
              });
              _this.div({
                "class": 'block'
              }, function() {
                _this.label('Program Arguments:');
                return _this.input({
                  type: 'text',
                  "class": 'editor mini editor-colors native-key-bindings',
                  outlet: 'inputScriptArgs'
                });
              });
              return _this.div({
                "class": 'block'
              }, function() {
                var css;
                css = 'btn inline-block-tight';
                _this.button({
                  "class": "btn " + css,
                  click: 'close'
                }, 'Close');
                return _this.button({
                  "class": "btn " + css,
                  click: 'run'
                }, 'Run');
              });
            });
          });
        };
      })(this));
    };

    ScriptOptionsView.prototype.initialize = function(runOptions) {
      this.runOptions = runOptions;
      atom.workspaceView.command('script:run-options', (function(_this) {
        return function() {
          return _this.toggleScriptOptions();
        };
      })(this));
      atom.workspaceView.command('script:close-options', (function(_this) {
        return function() {
          return _this.toggleScriptOptions('hide');
        };
      })(this));
      atom.workspaceView.command('script:save-options', (function(_this) {
        return function() {
          return _this.saveOptions();
        };
      })(this));
      atom.workspaceView.prependToTop(this);
      return this.toggleScriptOptions('hide');
    };

    ScriptOptionsView.prototype.toggleScriptOptions = function(command) {
      switch (command) {
        case 'show':
          return this.scriptOptionsView.show();
        case 'hide':
          return this.scriptOptionsView.hide();
        default:
          return this.scriptOptionsView.toggle();
      }
    };

    ScriptOptionsView.prototype.saveOptions = function() {
      var splitArgs;
      splitArgs = function(element) {
        var item, _i, _len, _ref, _results;
        _ref = element.val().split(' ');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (item !== '') {
            _results.push(item);
          }
        }
        return _results;
      };
      this.runOptions.workingDirectory = this.inputCwd.val();
      this.runOptions.cmd = this.inputCommand.val();
      this.runOptions.cmdArgs = splitArgs(this.inputCommandArgs);
      return this.runOptions.scriptArgs = splitArgs(this.inputScriptArgs);
    };

    ScriptOptionsView.prototype.close = function() {
      return atom.workspaceView.trigger('script:close-options');
    };

    ScriptOptionsView.prototype.run = function() {
      atom.workspaceView.trigger('script:save-options');
      atom.workspaceView.trigger('script:close-options');
      return atom.workspaceView.trigger('script:run');
    };

    return ScriptOptionsView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLHdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGlCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDSCxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sd0JBQVA7QUFBQSxZQUFpQyxNQUFBLEVBQVEsbUJBQXpDO1dBQUwsRUFBbUUsU0FBQSxHQUFBO0FBQ2pFLFlBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLGVBQVA7YUFBTCxFQUE2Qix1QkFBN0IsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxtQkFBUDthQUFMLEVBQWlDLFNBQUEsR0FBQTtBQUMvQixjQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxnQkFBQSxPQUFBLEVBQU8sT0FBUDtlQUFMLEVBQXFCLFNBQUEsR0FBQTtBQUNuQixnQkFBQSxLQUFDLENBQUEsS0FBRCxDQUFPLDRCQUFQLENBQUEsQ0FBQTt1QkFDQSxLQUFDLENBQUEsS0FBRCxDQUNFO0FBQUEsa0JBQUEsSUFBQSxFQUFNLE1BQU47QUFBQSxrQkFDQSxPQUFBLEVBQU8sK0NBRFA7QUFBQSxrQkFFQSxNQUFBLEVBQVEsVUFGUjtpQkFERixFQUZtQjtjQUFBLENBQXJCLENBQUEsQ0FBQTtBQUFBLGNBTUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFB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
//# sourceURL=/Users/zeke/.atom/packages/script/lib/script-options-view.coffee