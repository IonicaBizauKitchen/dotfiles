(function() {
  var WordcountView;

  WordcountView = require('./wordcount-view');

  module.exports = {
    WordcountView: null,
    DEFAULT_FILES: 'md markdown readme txt rst',
    activate: function() {
      atom.config.setDefaults('wordcount.files', {
        'File extensions': this.DEFAULT_FILES
      });
      return setTimeout(function() {
        return this.WordcountView = new WordcountView();
      }, 1000);
    },
    deactivate: function() {
      if (!this.WordcountView) {
        this.WordcountView = new WordcountView();
      }
      return this.WordcountView.destroy();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGFBQUE7O0FBQUEsRUFBQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQkFBUixDQUFoQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsYUFBQSxFQUFlLElBQWY7QUFBQSxJQUVBLGFBQUEsRUFBZSw0QkFGZjtBQUFBLElBSUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLGlCQUF4QixFQUEyQztBQUFBLFFBQ3pDLGlCQUFBLEVBQW1CLElBQUMsQ0FBQSxhQURxQjtPQUEzQyxDQUFBLENBQUE7YUFJQSxVQUFBLENBQVcsU0FBQSxHQUFBO2VBQ1QsSUFBQyxDQUFBLGFBQUQsR0FBcUIsSUFBQSxhQUFBLENBQUEsRUFEWjtNQUFBLENBQVgsRUFFRSxJQUZGLEVBTFE7SUFBQSxDQUpWO0FBQUEsSUFhQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFBLENBQUEsSUFBNkMsQ0FBQSxhQUE3QztBQUFBLFFBQUEsSUFBQyxDQUFBLGFBQUQsR0FBcUIsSUFBQSxhQUFBLENBQUEsQ0FBckIsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsRUFGVTtJQUFBLENBYlo7R0FIRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/zeke/.atom/packages/wordcount/lib/wordcount.coffee