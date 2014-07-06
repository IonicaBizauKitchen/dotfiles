(function() {
  var $;

  $ = require('atom').$;

  module.exports = {
    configDefaults: {
      enabled: false
    },
    activate: function() {
      atom.workspaceView.on('focusout', ".editor:not(.mini)", (function(_this) {
        return function(event) {
          var editor, _ref;
          editor = (_ref = event.targetView()) != null ? _ref.getModel() : void 0;
          return _this.autosave(editor);
        };
      })(this));
      atom.workspaceView.on('pane:before-item-destroyed', (function(_this) {
        return function(event, paneItem) {
          return _this.autosave(paneItem);
        };
      })(this));
      return $(window).preempt('beforeunload', (function(_this) {
        return function() {
          var pane, paneItem, _i, _len, _ref, _results;
          _ref = atom.workspaceView.getPanes();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            pane = _ref[_i];
            _results.push((function() {
              var _j, _len1, _ref1, _results1;
              _ref1 = pane.getItems();
              _results1 = [];
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                paneItem = _ref1[_j];
                _results1.push(this.autosave(paneItem));
              }
              return _results1;
            }).call(_this));
          }
          return _results;
        };
      })(this));
    },
    autosave: function(paneItem) {
      if (!atom.config.get('autosave.enabled')) {
        return;
      }
      if ((paneItem != null ? typeof paneItem.getUri === "function" ? paneItem.getUri() : void 0 : void 0) == null) {
        return;
      }
      if (!(paneItem != null ? typeof paneItem.isModified === "function" ? paneItem.isModified() : void 0 : void 0)) {
        return;
      }
      return paneItem != null ? typeof paneItem.save === "function" ? paneItem.save() : void 0 : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLENBQUE7O0FBQUEsRUFBQyxJQUFLLE9BQUEsQ0FBUSxNQUFSLEVBQUwsQ0FBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxPQUFBLEVBQVMsS0FBVDtLQURGO0FBQUEsSUFHQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQW5CLENBQXNCLFVBQXRCLEVBQWtDLG9CQUFsQyxFQUF3RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEdBQUE7QUFDdEQsY0FBQSxZQUFBO0FBQUEsVUFBQSxNQUFBLDZDQUEyQixDQUFFLFFBQXBCLENBQUEsVUFBVCxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxRQUFELENBQVUsTUFBVixFQUZzRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhELENBQUEsQ0FBQTtBQUFBLE1BSUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFuQixDQUFzQiw0QkFBdEIsRUFBb0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxFQUFRLFFBQVIsR0FBQTtpQkFDbEQsS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWLEVBRGtEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEQsQ0FKQSxDQUFBO2FBT0EsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLE9BQVYsQ0FBa0IsY0FBbEIsRUFBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNoQyxjQUFBLHdDQUFBO0FBQUE7QUFBQTtlQUFBLDJDQUFBOzRCQUFBO0FBQ0U7O0FBQUE7QUFBQTttQkFBQSw4Q0FBQTtxQ0FBQTtBQUFBLCtCQUFBLElBQUMsQ0FBQSxRQUFELENBQVUsUUFBVixFQUFBLENBQUE7QUFBQTs7MkJBQUEsQ0FERjtBQUFBOzBCQURnQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLEVBUlE7SUFBQSxDQUhWO0FBQUEsSUFlQSxRQUFBLEVBQVUsU0FBQyxRQUFELEdBQUE7QUFDUixNQUFBLElBQUEsQ0FBQSxJQUFrQixDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtCQUFoQixDQUFkO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFDQSxNQUFBLElBQWMsd0dBQWQ7QUFBQSxjQUFBLENBQUE7T0FEQTtBQUVBLE1BQUEsSUFBQSxDQUFBLGdFQUFjLFFBQVEsQ0FBRSwrQkFBeEI7QUFBQSxjQUFBLENBQUE7T0FGQTtzRUFJQSxRQUFRLENBQUUseUJBTEY7SUFBQSxDQWZWO0dBSEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/zeke/.atom/packages/autosave/lib/autosave.coffee