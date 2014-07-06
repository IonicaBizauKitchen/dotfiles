(function() {
  var EditorView, HighlightedAreaView, MarkerView, Range, View, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MarkerView = require('./marker-view');

  _ref = require('atom'), EditorView = _ref.EditorView, View = _ref.View, Range = _ref.Range;

  _ = require('underscore-plus');

  module.exports = HighlightedAreaView = (function(_super) {
    __extends(HighlightedAreaView, _super);

    function HighlightedAreaView() {
      this.removeMarkers = __bind(this.removeMarkers, this);
      this.handleSelection = __bind(this.handleSelection, this);
      this.destroy = __bind(this.destroy, this);
      this.attach = __bind(this.attach, this);
      return HighlightedAreaView.__super__.constructor.apply(this, arguments);
    }

    HighlightedAreaView.content = function() {
      return this.div({
        "class": 'highlight-selected'
      });
    };

    HighlightedAreaView.prototype.initialize = function(editorView) {
      this.views = [];
      return this.editorView = editorView;
    };

    HighlightedAreaView.prototype.attach = function() {
      this.editorView.underlayer.append(this);
      this.subscribe(this.editorView, "selection:changed", this.handleSelection);
      return atom.workspaceView.on('pane:item-removed', this.destroy);
    };

    HighlightedAreaView.prototype.destroy = function() {
      var editor, found, _i, _len, _ref1;
      found = false;
      _ref1 = atom.workspaceView.getEditorViews();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        editor = _ref1[_i];
        if (editor.id === this.editorView.id) {
          found = true;
        }
      }
      if (found) {
        return;
      }
      atom.workspaceView.off('pane:item-removed', this.destroy);
      this.unsubscribe();
      this.remove();
      return this.detach();
    };

    HighlightedAreaView.prototype.getEditorView = function() {
      var activeView;
      activeView = atom.workspaceView.getActiveView();
      if (activeView instanceof EditorView) {
        return activeView;
      } else {
        return null;
      }
    };

    HighlightedAreaView.prototype.getActiveEditor = function() {
      return atom.workspace.getActiveEditor();
    };

    HighlightedAreaView.prototype.handleSelection = function() {
      var editor, range, regex, regexSearch, result, text, view, _i, _len, _ref1, _results;
      this.removeMarkers();
      if (!(editor = this.getActiveEditor())) {
        return;
      }
      if (editor.getSelection().isEmpty()) {
        return;
      }
      if (!this.isWordSelected(editor.getSelection())) {
        return;
      }
      text = _.escapeRegExp(editor.getSelectedText());
      regex = new RegExp("\\W*\\w*\\b", 'gi');
      result = regex.exec(text);
      if (result == null) {
        return;
      }
      if (result.length === 0 || result.index !== 0 || result[0] !== result.input) {
        return;
      }
      range = [[0, 0], editor.getEofBufferPosition()];
      this.ranges = [];
      regexSearch = result[0];
      if (atom.config.get('highlight-selected.onlyHighlightWholeWords')) {
        regexSearch = "\\b" + regexSearch + "\\b";
      }
      editor.scanInBufferRange(new RegExp(regexSearch, 'g'), range, (function(_this) {
        return function(result) {
          var prefix;
          if (prefix = result.match[1]) {
            result.range = result.range.translate([0, prefix.length], [0, 0]);
          }
          return _this.ranges.push(editor.markBufferRange(result.range).getScreenRange());
        };
      })(this));
      _ref1 = this.ranges;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        range = _ref1[_i];
        view = new MarkerView(range, this, this.getEditorView());
        this.append(view.element);
        _results.push(this.views.push(view));
      }
      return _results;
    };

    HighlightedAreaView.prototype.removeMarkers = function() {
      var view, _i, _len, _ref1;
      if (this.views == null) {
        return;
      }
      if (this.views.length === 0) {
        return;
      }
      _ref1 = this.views;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        view = _ref1[_i];
        view.element.remove();
        view = null;
      }
      return this.views = [];
    };

    HighlightedAreaView.prototype.isWordSelected = function(selection) {
      var lineRange, nonWordCharacterToTheLeft, nonWordCharacterToTheRight, selectionRange;
      if (selection.getBufferRange().isSingleLine()) {
        selectionRange = selection.getBufferRange();
        lineRange = this.getActiveEditor().bufferRangeForBufferRow(selectionRange.start.row);
        nonWordCharacterToTheLeft = _.isEqual(selectionRange.start, lineRange.start) || this.isNonWordCharacterToTheLeft(selection);
        nonWordCharacterToTheRight = _.isEqual(selectionRange.end, lineRange.end) || this.isNonWordCharacterToTheRight(selection);
        return nonWordCharacterToTheLeft && nonWordCharacterToTheRight;
      } else {
        return false;
      }
    };

    HighlightedAreaView.prototype.isNonWordCharacter = function(character) {
      var nonWordCharacters;
      nonWordCharacters = atom.config.get('editor.nonWordCharacters');
      return new RegExp("[ \t" + (_.escapeRegExp(nonWordCharacters)) + "]").test(character);
    };

    HighlightedAreaView.prototype.isNonWordCharacterToTheLeft = function(selection) {
      var range, selectionStart;
      selectionStart = selection.getBufferRange().start;
      range = Range.fromPointWithDelta(selectionStart, 0, -1);
      return this.isNonWordCharacter(this.getActiveEditor().getTextInBufferRange(range));
    };

    HighlightedAreaView.prototype.isNonWordCharacterToTheRight = function(selection) {
      var range, selectionEnd;
      selectionEnd = selection.getBufferRange().end;
      range = Range.fromPointWithDelta(selectionEnd, 0, 1);
      return this.isNonWordCharacter(this.getActiveEditor().getTextInBufferRange(range));
    };

    return HighlightedAreaView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlFQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBQWIsQ0FBQTs7QUFBQSxFQUNBLE9BQTRCLE9BQUEsQ0FBUSxNQUFSLENBQTVCLEVBQUMsa0JBQUEsVUFBRCxFQUFhLFlBQUEsSUFBYixFQUFtQixhQUFBLEtBRG5CLENBQUE7O0FBQUEsRUFFQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBRkosQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiwwQ0FBQSxDQUFBOzs7Ozs7OztLQUFBOztBQUFBLElBQUEsbUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLG9CQUFQO09BQUwsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSxrQ0FHQSxVQUFBLEdBQVksU0FBQyxVQUFELEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsRUFBVCxDQUFBO2FBQ0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxXQUZKO0lBQUEsQ0FIWixDQUFBOztBQUFBLGtDQU9BLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixNQUFBLElBQUMsQ0FBQSxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQXZCLENBQThCLElBQTlCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFDLENBQUEsVUFBWixFQUF3QixtQkFBeEIsRUFBNkMsSUFBQyxDQUFBLGVBQTlDLENBREEsQ0FBQTthQUVBLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBbkIsQ0FBc0IsbUJBQXRCLEVBQTJDLElBQUMsQ0FBQSxPQUE1QyxFQUhNO0lBQUEsQ0FQUixDQUFB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
//# sourceURL=/Users/zeke/.atom/packages/highlight-selected/lib/highlighted-area-view.coffee