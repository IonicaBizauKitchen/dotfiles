(function() {
  var $, $$, Range, _, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('underscore-plus');

  _ref = require('atom'), $ = _ref.$, $$ = _ref.$$, Range = _ref.Range;

  module.exports = {
    configDefaults: {
      includeCompletionsFromAllBuffers: false,
      includeGrammarKeywords: false,
      regexFlags: "",
      confirmKeys: [8, 9, 13, 32, 37, 38, 39, 40, 46, 48, 49, 50, 51, 57, 91, 186, 188, 190, 191, 192, 219, 220, 221, 222]
    },
    wordRegex: /\w+/g,
    wordList: null,
    currentWordPos: -1,
    currentMatches: null,
    editor: null,
    currentBuffer: null,
    editorView: null,
    activate: function() {
      var confirmKeys;
      confirmKeys = atom.config.get('inline-autocomplete.confirmKeys');
      atom.workspaceView.eachEditorView((function(_this) {
        return function(editorView) {
          return editorView.on('keydown', function(e) {
            var _ref1;
            if ((_ref1 = e.keyCode, __indexOf.call(confirmKeys, _ref1) >= 0) && editorView && editorView.hasClass('inline-autocompleting')) {
              return _this.reset();
            }
          });
        };
      })(this));
      atom.workspaceView.on('click', (function(_this) {
        return function(e) {
          if ((_this.editorView != null) && _this.editorView.hasClass('inline-autocompleting')) {
            return _this.reset();
          }
        };
      })(this));
      atom.workspaceView.command('inline-autocomplete:stop', (function(_this) {
        return function(e) {
          return _this.reset();
        };
      })(this));
      atom.workspaceView.command('inline-autocomplete:cycle-back', (function(_this) {
        return function(e) {
          return _this.toggleAutocomplete(e, -1);
        };
      })(this));
      return atom.workspaceView.command('inline-autocomplete:cycle', (function(_this) {
        return function(e) {
          return _this.toggleAutocomplete(e, 1);
        };
      })(this));
    },
    toggleAutocomplete: function(e, step) {
      var cursor, cursorPosition;
      this.editor = atom.workspace.getActiveEditor();
      if (this.editor != null) {
        this.currentBuffer = this.editor.getBuffer();
        this.editorView = atom.workspaceView.getActiveView();
        cursor = this.editor.getCursor();
        cursorPosition = this.editor.getCursorBufferPosition();
        if ((this.editorView.editor != null) && this.editorView.isFocused && cursor.isVisible() && this.currentBuffer.getTextInRange(Range.fromPointWithDelta(cursorPosition, 0, -1)).match(/^\w$/) && this.currentBuffer.getTextInRange(Range.fromPointWithDelta(cursorPosition, 0, 1)).match(/^\W*$/)) {
          this.editorView.addClass('inline-autocompleting');
          return this.cycleAutocompleteWords(step);
        } else {
          this.reset();
          return e.abortKeyBinding();
        }
      } else {
        this.reset();
        return e.abortKeyBinding();
      }
    },
    buildWordList: function() {
      var buffer, buffers, grammar, matches, rawPattern, strippedPattern, word, wordHash, words, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref1, _ref2, _ref3;
      wordHash = {};
      if (atom.config.get('inline-autocomplete.includeCompletionsFromAllBuffers')) {
        buffers = atom.project.getBuffers();
      } else {
        buffers = [this.currentBuffer];
      }
      matches = [];
      if (atom.config.get('inline-autocomplete.includeGrammarKeywords')) {
        grammar = atom.workspaceView.getActiveView().getEditor().getGrammar();
        _ref1 = grammar.rawPatterns;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          rawPattern = _ref1[_i];
          if (rawPattern.match) {
            strippedPattern = rawPattern.match.replace(/\\.{1}/g, '');
            if (words = strippedPattern.match(/\w+/g)) {
              if ((function() {
                var _j, _len1, _results;
                _results = [];
                for (_j = 0, _len1 = words.length; _j < _len1; _j++) {
                  word = words[_j];
                  _results.push(word.match(this.wordRegex));
                }
                return _results;
              }).call(this)) {
                matches.push(word.match(this.wordRegex));
              }
            }
          }
        }
      }
      for (_j = 0, _len1 = buffers.length; _j < _len1; _j++) {
        buffer = buffers[_j];
        matches.push(buffer.getText().match(this.wordRegex));
      }
      _ref2 = _.flatten(matches);
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        word = _ref2[_k];
        if (wordHash[word] == null) {
          wordHash[word] = true;
        }
      }
      _ref3 = this.getCompletionsForCursorScope();
      for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
        word = _ref3[_l];
        if (wordHash[word] == null) {
          wordHash[word] = true;
        }
      }
      return this.wordList = Object.keys(wordHash).sort(function(word1, word2) {
        return word1.toLowerCase().localeCompare(word2.toLowerCase());
      });
    },
    replaceSelectedTextWithMatch: function(match) {
      var buffer, selection, startPosition;
      selection = this.editor.getSelection();
      startPosition = selection.getBufferRange().start;
      buffer = this.editor.getBuffer();
      selection.selectWord();
      return selection.insertText(match.word, {
        select: false,
        undo: 'skip'
      });
    },
    prefixAndSuffixOfSelection: function(selection) {
      var lineRange, prefix, selectionRange, suffix, _ref1;
      selectionRange = selection.getBufferRange();
      lineRange = [[selectionRange.start.row, 0], [selectionRange.end.row, this.editor.lineLengthForBufferRow(selectionRange.end.row)]];
      _ref1 = ["", ""], prefix = _ref1[0], suffix = _ref1[1];
      this.currentBuffer.scanInRange(this.wordRegex, lineRange, function(_arg) {
        var match, prefixOffset, range, stop, suffixOffset;
        match = _arg.match, range = _arg.range, stop = _arg.stop;
        if (range.start.isGreaterThan(selectionRange.end)) {
          stop();
        }
        if (range.intersectsWith(selectionRange)) {
          prefixOffset = selectionRange.start.column - range.start.column;
          suffixOffset = selectionRange.end.column - range.end.column;
          if (range.start.isLessThan(selectionRange.start)) {
            prefix = match[0].slice(0, prefixOffset);
          }
          if (range.end.isGreaterThan(selectionRange.end)) {
            return suffix = match[0].slice(suffixOffset);
          }
        }
      });
      return {
        prefix: prefix,
        suffix: suffix
      };
    },
    getCompletionsForCursorScope: function() {
      var completions, cursorScope;
      cursorScope = this.editor.scopesForBufferPosition(this.editor.getCursorBufferPosition());
      completions = atom.syntax.propertiesForScope(cursorScope, 'editor.completions');
      completions = completions.map(function(properties) {
        return _.valueForKeyPath(properties, 'editor.completions');
      });
      return _.uniq(_.flatten(completions));
    },
    findMatchesForCurrentSelection: function() {
      var currentWord, prefix, regex, selection, suffix, word, _i, _j, _len, _len1, _ref1, _ref2, _ref3, _results, _results1;
      selection = this.editor.getSelection();
      _ref1 = this.prefixAndSuffixOfSelection(selection), prefix = _ref1.prefix, suffix = _ref1.suffix;
      if ((prefix.length + suffix.length) > 0) {
        regex = new RegExp("^" + prefix + ".+" + suffix + "$", atom.config.get('inline-autocomplete.regexFlags'));
        currentWord = prefix + this.editor.getSelectedText() + suffix;
        _ref2 = this.wordList;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          word = _ref2[_i];
          if (regex.test(word) && word !== currentWord) {
            _results.push({
              prefix: prefix,
              suffix: suffix,
              word: word
            });
          }
        }
        return _results;
      } else {
        _ref3 = this.wordList;
        _results1 = [];
        for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
          word = _ref3[_j];
          _results1.push({
            word: word,
            prefix: prefix,
            suffix: suffix
          });
        }
        return _results1;
      }
    },
    cycleAutocompleteWords: function(steps) {
      if (this.wordList == null) {
        this.buildWordList();
      }
      if (this.currentMatches == null) {
        this.currentMatches = this.findMatchesForCurrentSelection();
      }
      if (this.currentMatches.length > 0) {
        if (steps + this.currentWordPos < 0) {
          this.currentWordPos = this.currentMatches.length + steps;
        } else {
          this.currentWordPos += steps;
        }
        this.currentWordPos %= this.currentMatches.length;
        return this.replaceSelectedTextWithMatch(this.currentMatches[this.currentWordPos]);
      }
    },
    reset: function() {
      if (this.editorView) {
        this.editorView.removeClass('inline-autocompleting');
      }
      this.wordList = null;
      this.currentWordPos = -1;
      this.currentMatches = null;
      this.currentBuffer = null;
      return this.editorView = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFCQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLE9BQWlCLE9BQUEsQ0FBUSxNQUFSLENBQWpCLEVBQUMsU0FBQSxDQUFELEVBQUksVUFBQSxFQUFKLEVBQVEsYUFBQSxLQURSLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxjQUFBLEVBQ0U7QUFBQSxNQUFBLGdDQUFBLEVBQWtDLEtBQWxDO0FBQUEsTUFDQSxzQkFBQSxFQUF3QixLQUR4QjtBQUFBLE1BRUEsVUFBQSxFQUFZLEVBRlo7QUFBQSxNQUdBLFdBQUEsRUFBYSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sRUFBUCxFQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCLEVBQTNCLEVBQStCLEVBQS9CLEVBQW1DLEVBQW5DLEVBQXVDLEVBQXZDLEVBQTJDLEVBQTNDLEVBQStDLEVBQS9DLEVBQW1ELEVBQW5ELEVBQXVELEVBQXZELEVBQTJELEdBQTNELEVBQWdFLEdBQWhFLEVBQXFFLEdBQXJFLEVBQTBFLEdBQTFFLEVBQStFLEdBQS9FLEVBQW9GLEdBQXBGLEVBQXlGLEdBQXpGLEVBQThGLEdBQTlGLEVBQW1HLEdBQW5HLENBSGI7S0FERjtBQUFBLElBTUEsU0FBQSxFQUFpQixNQU5qQjtBQUFBLElBT0EsUUFBQSxFQUFpQixJQVBqQjtBQUFBLElBUUEsY0FBQSxFQUFpQixDQUFBLENBUmpCO0FBQUEsSUFTQSxjQUFBLEVBQWlCLElBVGpCO0FBQUEsSUFVQSxNQUFBLEVBQWlCLElBVmpCO0FBQUEsSUFXQSxhQUFBLEVBQWlCLElBWGpCO0FBQUEsSUFZQSxVQUFBLEVB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
//# sourceURL=/Users/zeke/.atom/packages/inline-autocomplete/lib/inline-autocomplete.coffee