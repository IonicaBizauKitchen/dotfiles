(function() {
  var HighlightedAreaView, areas;

  HighlightedAreaView = require('./highlighted-area-view');

  areas = [];

  module.exports = {
    configDefaults: {
      onlyHighlightWholeWords: false
    },
    activate: function(state) {
      return atom.workspaceView.eachEditorView(function(editorView) {
        var area;
        area = new HighlightedAreaView(editorView);
        area.attach();
        return areas.push = area;
      });
    },
    deactivate: function() {
      var area, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = areas.length; _i < _len; _i++) {
        area = areas[_i];
        _results.push(area.destroy());
      }
      return _results;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBCQUFBOztBQUFBLEVBQUEsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHlCQUFSLENBQXRCLENBQUE7O0FBQUEsRUFDQSxLQUFBLEdBQVEsRUFEUixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSx1QkFBQSxFQUF5QixLQUF6QjtLQURGO0FBQUEsSUFHQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7YUFDUixJQUFJLENBQUMsYUFBYSxDQUFDLGNBQW5CLENBQWtDLFNBQUMsVUFBRCxHQUFBO0FBQ2hDLFlBQUEsSUFBQTtBQUFBLFFBQUEsSUFBQSxHQUFXLElBQUEsbUJBQUEsQ0FBb0IsVUFBcEIsQ0FBWCxDQUFBO0FBQUEsUUFDQSxJQUFJLENBQUMsTUFBTCxDQUFBLENBREEsQ0FBQTtlQUVBLEtBQUssQ0FBQyxJQUFOLEdBQWEsS0FIbUI7TUFBQSxDQUFsQyxFQURRO0lBQUEsQ0FIVjtBQUFBLElBU0EsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsd0JBQUE7QUFBQTtXQUFBLDRDQUFBO3lCQUFBO0FBQ0Usc0JBQUEsSUFBSSxDQUFDLE9BQUwsQ0FBQSxFQUFBLENBREY7QUFBQTtzQkFEVTtJQUFBLENBVFo7R0FKRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/zeke/.atom/packages/highlight-selected/lib/highlight-selected.coffee