(function() {
  var ScriptOptions, ScriptOptionsView, ScriptView;

  ScriptView = require('./script-view');

  ScriptOptionsView = require('./script-options-view');

  ScriptOptions = require('./script-options');

  module.exports = {
    scriptView: null,
    scriptOptionsView: null,
    scriptOptions: null,
    activate: function(state) {
      this.scriptOptions = new ScriptOptions();
      this.scriptView = new ScriptView(state.scriptViewState, this.scriptOptions);
      return this.scriptOptionsView = new ScriptOptionsView(this.scriptOptions);
    },
    deactivate: function() {
      this.scriptView.close();
      return this.scriptOptionsView.close();
    },
    serialize: function() {
      return {
        scriptViewState: this.scriptView.serialize(),
        scriptOptionsViewState: this.scriptOptionsView.serialize()
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRDQUFBOztBQUFBLEVBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBQWIsQ0FBQTs7QUFBQSxFQUNBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx1QkFBUixDQURwQixDQUFBOztBQUFBLEVBRUEsYUFBQSxHQUFnQixPQUFBLENBQVEsa0JBQVIsQ0FGaEIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFVBQUEsRUFBWSxJQUFaO0FBQUEsSUFDQSxpQkFBQSxFQUFtQixJQURuQjtBQUFBLElBRUEsYUFBQSxFQUFlLElBRmY7QUFBQSxJQUlBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBcUIsSUFBQSxhQUFBLENBQUEsQ0FBckIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFVBQUQsR0FBa0IsSUFBQSxVQUFBLENBQVcsS0FBSyxDQUFDLGVBQWpCLEVBQWtDLElBQUMsQ0FBQSxhQUFuQyxDQURsQixDQUFBO2FBRUEsSUFBQyxDQUFBLGlCQUFELEdBQXlCLElBQUEsaUJBQUEsQ0FBa0IsSUFBQyxDQUFBLGFBQW5CLEVBSGpCO0lBQUEsQ0FKVjtBQUFBLElBU0EsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxLQUFaLENBQUEsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLGlCQUFpQixDQUFDLEtBQW5CLENBQUEsRUFGVTtJQUFBLENBVFo7QUFBQSxJQWFBLFNBQUEsRUFBVyxTQUFBLEdBQUE7YUFHVDtBQUFBLFFBQUEsZUFBQSxFQUFpQixJQUFDLENBQUEsVUFBVSxDQUFDLFNBQVosQ0FBQSxDQUFqQjtBQUFBLFFBQ0Esc0JBQUEsRUFBd0IsSUFBQyxDQUFBLGlCQUFpQixDQUFDLFNBQW5CLENBQUEsQ0FEeEI7UUFIUztJQUFBLENBYlg7R0FMRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/zeke/.atom/packages/script/lib/script.coffee