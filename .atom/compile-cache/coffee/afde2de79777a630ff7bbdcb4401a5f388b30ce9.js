(function() {
  var AnsiFilter, BufferedProcess, HeaderView, ScriptView, View, grammarMap, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  grammarMap = require('./grammars');

  _ref = require('atom'), View = _ref.View, BufferedProcess = _ref.BufferedProcess;

  HeaderView = require('./header-view');

  AnsiFilter = require('ansi-to-html');

  module.exports = ScriptView = (function(_super) {
    __extends(ScriptView, _super);

    function ScriptView() {
      return ScriptView.__super__.constructor.apply(this, arguments);
    }

    ScriptView.bufferedProcess = null;

    ScriptView.content = function() {
      return this.div({
        "class": 'outer-scriptView'
      }, (function(_this) {
        return function() {
          _this.subview('headerView', new HeaderView());
          return _this.div({
            "class": 'tool-panel panel panel-bottom padding scriptView',
            outlet: 'script',
            tabindex: -1
          }, function() {
            return _this.div({
              "class": 'panel-body padded output',
              outlet: 'output'
            });
          });
        };
      })(this));
    };

    ScriptView.prototype.initialize = function(serializeState) {
      atom.workspaceView.command("script:run", (function(_this) {
        return function() {
          return _this.start();
        };
      })(this));
      atom.workspaceView.command("script:close-view", (function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
      atom.workspaceView.command("script:kill-process", (function(_this) {
        return function() {
          return _this.stop();
        };
      })(this));
      return this.ansiFilter = new AnsiFilter;
    };

    ScriptView.prototype.serialize = function() {};

    ScriptView.prototype.start = function() {
      var editor, info;
      editor = atom.workspace.getActiveEditor();
      if (editor == null) {
        return;
      }
      this.resetView();
      info = this.setup(editor);
      if (info) {
        return this.run(info.command, info.args);
      }
    };

    ScriptView.prototype.resetView = function() {
      if (!this.hasParent()) {
        atom.workspaceView.prependToBottom(this);
      }
      this.stop();
      this.headerView.title.text("Loading...");
      this.headerView.setStatus("start");
      return this.output.empty();
    };

    ScriptView.prototype.close = function() {
      this.stop();
      if (this.hasParent()) {
        return this.detach();
      }
    };

    ScriptView.prototype.getlang = function(editor) {
      var grammar, lang;
      grammar = editor.getGrammar();
      lang = grammar.name;
      return lang;
    };

    ScriptView.prototype.setup = function(editor) {
      var arg, argType, args, err, error, filename, filepath, info, lang, makeargs, selectedText;
      info = {};
      lang = this.getlang(editor);
      err = null;
      if (lang === "Null Grammar" || lang === "Plain Text") {
        err = "Must select a language in the lower left or " + "save the file with an appropriate extension.";
      } else if (!(lang in grammarMap)) {
        err = "Command not configured for " + lang + "!\n\n" + "Add an <a href='https://github.com/rgbkrk/atom-script/issues/" + "new?title=Add%20support%20for%20" + lang + "'>issue on GitHub" + "</a> or send your own Pull Request";
      }
      if (err != null) {
        this.handleError(err);
        return false;
      }
      info.command = grammarMap[lang]["command"];
      filename = editor.getTitle();
      selectedText = editor.getSelectedText();
      filepath = editor.getPath();
      if (((selectedText == null) || !selectedText) && (filepath == null)) {
        selectedText = editor.getText();
      }
      if (((selectedText == null) || !selectedText) && (filepath != null)) {
        argType = "File Based";
        arg = filepath;
      } else {
        argType = "Selection Based";
        arg = selectedText;
      }
      makeargs = grammarMap[lang][argType];
      try {
        args = makeargs(arg);
        info.args = args;
      } catch (_error) {
        error = _error;
        err = argType + " Runner not available for " + lang + "\n\n" + "If it should exist add an " + "<a href='https://github.com/rgbkrk/atom-script/issues/" + "new?title=Add%20support%20for%20" + lang + "'>issue on GitHub" + "</a> or send your own Pull Request";
        this.handleError(err);
        return false;
      }
      this.headerView.title.text(lang + " - " + filename);
      return info;
    };

    ScriptView.prototype.handleError = function(err) {
      this.headerView.title.text("Error");
      this.headerView.setStatus("err");
      this.display("error", err);
      return this.stop();
    };

    ScriptView.prototype.run = function(command, args) {
      var exit, options, stderr, stdout;
      atom.emit("achievement:unlock", {
        msg: "Homestar Runner"
      });
      options = {
        cwd: atom.project.getPath(),
        env: process.env
      };
      stdout = (function(_this) {
        return function(output) {
          return _this.display("stdout", output);
        };
      })(this);
      stderr = (function(_this) {
        return function(output) {
          return _this.display("stderr", output);
        };
      })(this);
      exit = (function(_this) {
        return function(return_code) {
          if (return_code === 0) {
            _this.headerView.setStatus("stop");
          } else {
            _this.headerView.setStatus("err");
          }
          return console.log("Exited with " + return_code);
        };
      })(this);
      return this.bufferedProcess = new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
    };

    ScriptView.prototype.stop = function() {
      if ((this.bufferedProcess != null) && (this.bufferedProcess.process != null)) {
        this.display("stdout", "^C");
        this.headerView.setStatus("kill");
        return this.bufferedProcess.kill();
      }
    };

    ScriptView.prototype.display = function(css, line) {
      line = this.ansiFilter.toHtml(line);
      return this.output.append("<pre class='line " + css + "'>" + line + "</pre>");
    };

    return ScriptView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJFQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVIsQ0FBYixDQUFBOztBQUFBLEVBQ0EsT0FBMEIsT0FBQSxDQUFRLE1BQVIsQ0FBMUIsRUFBQyxZQUFBLElBQUQsRUFBTyx1QkFBQSxlQURQLENBQUE7O0FBQUEsRUFFQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FGYixDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBSmIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxVQUFDLENBQUEsZUFBRCxHQUFrQixJQUFsQixDQUFBOztBQUFBLElBRUEsVUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sa0JBQVA7T0FBTCxFQUFnQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzlCLFVBQUEsS0FBQyxDQUFBLE9BQUQsQ0FBUyxZQUFULEVBQTJCLElBQUEsVUFBQSxDQUFBLENBQTNCLENBQUEsQ0FBQTtpQkFFQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sa0RBQVA7QUFBQSxZQUEyRCxNQUFBLEVBQVEsUUFBbkU7QUFBQSxZQUE2RSxRQUFBLEVBQVUsQ0FBQSxDQUF2RjtXQUFMLEVBQWdHLFNBQUEsR0FBQTttQkFDOUYsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLDBCQUFQO0FBQUEsY0FBbUMsTUFBQSxFQUFRLFFBQTNDO2FBQUwsRUFEOEY7VUFBQSxDQUFoRyxFQUg4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
//# sourceURL=/Users/zeke/.atom/packages/script/lib/script-view.coffee