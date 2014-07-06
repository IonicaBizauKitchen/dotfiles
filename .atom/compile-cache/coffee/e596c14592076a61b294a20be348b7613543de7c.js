(function() {
  var View, WordcountView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  View = require('atom').View;

  module.exports = WordcountView = (function(_super) {
    __extends(WordcountView, _super);

    function WordcountView() {
      this.getCurrentText = __bind(this.getCurrentText, this);
      this.updateWordCountText = __bind(this.updateWordCountText, this);
      this.attach = __bind(this.attach, this);
      this.attachOrDestroy = __bind(this.attachOrDestroy, this);
      return WordcountView.__super__.constructor.apply(this, arguments);
    }

    WordcountView.prototype.CSS_SELECTED_CLASS = 'wordcount-select';

    WordcountView.content = function() {
      return this.div({
        "class": 'word-count inline-block'
      });
    };

    WordcountView.prototype.initialize = function() {
      if (atom.workspaceView.statusBar) {
        this.attach();
      } else {
        this.subscribe(atom.packages.once('activated', this.attach));
      }
      this.subscribe(atom.workspaceView, 'cursor:moved', this.updateWordCountText);
      this.subscribe(atom.workspaceView.statusBar, 'active-buffer-changed', this.updateWordCountText);
      return this.subscribe(atom.workspaceView.statusBar, 'active-buffer-changed', this.attachOrDestroy);
    };

    WordcountView.prototype.attachOrDestroy = function() {
      var current_file_extension, extensions, _ref, _ref1, _ref2;
      extensions = atom.config.get('wordcount.files')['File extensions'].split(' ').map(function(extension) {
        return extension.toLowerCase();
      });
      current_file_extension = (_ref = atom.workspaceView.getActivePaneItem()) != null ? (_ref1 = _ref.buffer) != null ? (_ref2 = _ref1.file) != null ? _ref2.path.split('.').pop().toLowerCase() : void 0 : void 0 : void 0;
      if (__indexOf.call(extensions, current_file_extension) >= 0) {
        return this.show();
      } else {
        return this.hide();
      }
    };

    WordcountView.prototype.attach = function() {
      atom.workspaceView.statusBar.prependRight(this);
      return this.attachOrDestroy();
    };

    WordcountView.prototype.destroy = function() {
      return this.remove();
    };

    WordcountView.prototype.afterAttach = function() {
      return this.updateWordCountText();
    };

    WordcountView.prototype.updateWordCountText = function() {
      var charCount, editor, text, wordCount, _ref;
      editor = atom.workspaceView.getActivePaneItem();
      text = this.getCurrentText(editor);
      _ref = this.count(text), wordCount = _ref[0], charCount = _ref[1];
      return this.text("" + (wordCount || 0) + " W | " + (charCount || 0) + " C");
    };

    WordcountView.prototype.getCurrentText = function(editor) {
      var selection, text, _ref;
      selection = (editor != null ? editor.getSelection : void 0) != null ? editor != null ? (_ref = editor.getSelection()) != null ? _ref.getText() : void 0 : void 0 : '';
      if (selection) {
        this.addClass(this.CSS_SELECTED_CLASS);
      } else {
        this.removeClass(this.CSS_SELECTED_CLASS);
      }
      text = (editor != null ? editor.getText : void 0) != null ? editor.getText() : '';
      return selection || text;
    };

    WordcountView.prototype.count = function(text) {
      var chars, words, _ref;
      words = text != null ? (_ref = text.match(/\S+/g)) != null ? _ref.length : void 0 : void 0;
      chars = text != null ? text.length : void 0;
      return [words, chars];
    };

    return WordcountView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBO0lBQUE7Ozt5SkFBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLE1BQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osb0NBQUEsQ0FBQTs7Ozs7Ozs7S0FBQTs7QUFBQSw0QkFBQSxrQkFBQSxHQUFvQixrQkFBcEIsQ0FBQTs7QUFBQSxJQUNBLGFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHlCQUFQO09BQUwsRUFEUTtJQUFBLENBRFYsQ0FBQTs7QUFBQSw0QkFJQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBRVYsTUFBQSxJQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBdEI7QUFDRSxRQUFBLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBQSxDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQWQsQ0FBbUIsV0FBbkIsRUFBZ0MsSUFBQyxDQUFBLE1BQWpDLENBQVgsQ0FBQSxDQUhGO09BQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBSSxDQUFDLGFBQWhCLEVBQStCLGNBQS9CLEVBQStDLElBQUMsQ0FBQSxtQkFBaEQsQ0FMQSxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBOUIsRUFBeUMsdUJBQXpDLEVBQWtFLElBQUMsQ0FBQSxtQkFBbkUsQ0FOQSxDQUFBO2FBT0EsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQTlCLEVBQXlDLHVCQUF6QyxFQUFrRSxJQUFD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
//# sourceURL=/Users/zeke/.atom/packages/wordcount/lib/wordcount-view.coffee