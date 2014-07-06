(function() {
  'use strict';
  var CSSComb, atomConfigJson, atomConfigPath, csscomb, fs, path, userConfigJson, userConfigPath;

  fs = require('fs');

  path = require('path');

  CSSComb = require('csscomb');

  csscomb = new CSSComb('csscomb');

  userConfigPath = atom.project.resolve('.csscomb.json');

  atomConfigPath = path.join(__dirname, '../csscomb.json');

  if (fs.existsSync(userConfigPath)) {
    userConfigJson = require(userConfigPath);
    csscomb.configure(userConfigJson);
  } else if (fs.existsSync(atomConfigPath)) {
    atomConfigJson = require(atomConfigPath);
    csscomb.configure(atomConfigJson);
  }

  module.exports = {
    activate: function(state) {
      return atom.workspaceView.command('csscomb:execute', (function(_this) {
        return function() {
          return _this.execute();
        };
      })(this));
    },
    getExecPath: function() {
      return "ATOM_SHELL_INTERNAL_RUN_AS_NODE=1 '" + process.execPath + "'";
    },
    getNodePath: function() {
      return atom.config.get('csscomb.nodepath');
    },
    execute: function() {
      var e, editor, grammarName, isCSS, isHTML, isLess, isScss, selectedText, sortedText, syntax, text;
      editor = atom.workspace.getActiveEditor();
      if (editor === false) {
        return;
      }
      grammarName = editor.getGrammar().name.toLowerCase();
      isCSS = grammarName === 'css';
      isScss = grammarName === 'scss';
      isLess = grammarName === 'less';
      isHTML = grammarName === 'html';
      syntax = 'css';
      if (isCSS) {
        syntax = 'css';
      }
      if (isScss) {
        syntax = 'scss';
      }
      if (isLess) {
        syntax = 'less';
      }
      if (isHTML) {
        syntax = 'css';
      }
      text = editor.getText();
      selectedText = editor.getSelectedText();
      if (selectedText.length !== 0) {
        try {
          sortedText = csscomb.processString(selectedText, syntax);
          return editor.setTextInBufferRange(editor.getSelectedBufferRange(), sortedText);
        } catch (_error) {
          e = _error;
          return console.log(e);
        }
      } else {
        try {
          sortedText = csscomb.processString(text, syntax);
          return editor.setText(sortedText);
        } catch (_error) {
          e = _error;
          return console.log(e);
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFlBQUEsQ0FBQTtBQUFBLE1BQUEsMEZBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUtBLE9BQUEsR0FBVSxPQUFBLENBQVEsU0FBUixDQUxWLENBQUE7O0FBQUEsRUFNQSxPQUFBLEdBQWMsSUFBQSxPQUFBLENBQVEsU0FBUixDQU5kLENBQUE7O0FBQUEsRUFPQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBYixDQUFxQixlQUFyQixDQVBqQixDQUFBOztBQUFBLEVBUUEsY0FBQSxHQUFpQixJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsaUJBQXJCLENBUmpCLENBQUE7O0FBVUEsRUFBQSxJQUFHLEVBQUUsQ0FBQyxVQUFILENBQWMsY0FBZCxDQUFIO0FBQ0UsSUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxjQUFSLENBQWpCLENBQUE7QUFBQSxJQUNBLE9BQU8sQ0FBQyxTQUFSLENBQWtCLGNBQWxCLENBREEsQ0FERjtHQUFBLE1BR0ssSUFBRyxFQUFFLENBQUMsVUFBSCxDQUFjLGNBQWQsQ0FBSDtBQUNILElBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsY0FBUixDQUFqQixDQUFBO0FBQUEsSUFDQSxPQUFPLENBQUMsU0FBUixDQUFrQixjQUFsQixDQURBLENBREc7R0FiTDs7QUFBQSxFQWlCQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7YUFDUixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLGlCQUEzQixFQUE4QyxDQUFBLFNBQUEsS0FBQSxHQUFB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
//# sourceURL=/Users/zeke/.atom/packages/atom-csscomb/lib/csscomb.coffee