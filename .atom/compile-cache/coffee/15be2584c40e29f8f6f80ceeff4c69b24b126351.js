(function() {
  var ScriptView;

  ScriptView = require('./script-view');

  module.exports = {
    scriptView: null,
    activate: function(state) {
      return this.scriptView = new ScriptView(state.scriptViewState);
    },
    deactivate: function() {
      return this.scriptView.close();
    },
    serialize: function() {
      return {
        scriptViewState: this.scriptView.serialize()
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FBYixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsVUFBQSxFQUFZLElBQVo7QUFBQSxJQUVBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxVQUFELEdBQWtCLElBQUEsVUFBQSxDQUFXLEtBQUssQ0FBQyxlQUFqQixFQURWO0lBQUEsQ0FGVjtBQUFBLElBS0EsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxVQUFVLENBQUMsS0FBWixDQUFBLEVBRFU7SUFBQSxDQUxaO0FBQUEsSUFRQSxTQUFBLEVBQVcsU0FBQSxHQUFBO2FBQ1Q7QUFBQSxRQUFBLGVBQUEsRUFBaUIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxTQUFaLENBQUEsQ0FBakI7UUFEUztJQUFBLENBUlg7R0FIRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/zeke/.atom/packages/script/lib/script.coffee