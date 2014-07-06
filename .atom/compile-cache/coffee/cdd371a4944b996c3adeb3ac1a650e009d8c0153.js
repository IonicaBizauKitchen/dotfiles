(function() {
  var $$, AnsiFilter, BufferedProcess, HeaderView, ScriptOptionsView, ScriptView, View, grammarMap, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  grammarMap = require('./grammars');

  _ref = require('atom'), View = _ref.View, BufferedProcess = _ref.BufferedProcess, $$ = _ref.$$;

  HeaderView = require('./header-view');

  ScriptOptionsView = require('./script-options-view');

  AnsiFilter = require('ansi-to-html');

  _ = require('underscore');

  module.exports = ScriptView = (function(_super) {
    __extends(ScriptView, _super);

    function ScriptView() {
      return ScriptView.__super__.constructor.apply(this, arguments);
    }

    ScriptView.bufferedProcess = null;

    ScriptView.content = function() {
      return this.div((function(_this) {
        return function() {
          var css;
          _this.subview('headerView', new HeaderView());
          css = 'tool-panel panel panel-bottom padding script-view native-key-bindings';
          return _this.div({
            "class": css,
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

    ScriptView.prototype.initialize = function(serializeState, runOptions) {
      this.runOptions = runOptions;
      atom.workspaceView.command('script:run', (function(_this) {
        return function() {
          return _this.start();
        };
      })(this));
      atom.workspaceView.command('script:close-view', (function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
      atom.workspaceView.command('script:kill-process', (function(_this) {
        return function() {
          return _this.stop();
        };
      })(this));
      return this.ansiFilter = new AnsiFilter;
    };

    ScriptView.prototype.serialize = function() {};

    ScriptView.prototype.updateOptions = function(event) {
      return this.runOptions = event.runOptions;
    };

    ScriptView.prototype.start = function() {
      var commandContext, editor;
      editor = atom.workspace.getActiveEditor();
      if (editor == null) {
        return;
      }
      this.resetView();
      commandContext = this.setup(editor);
      if (commandContext) {
        return this.run(commandContext.command, commandContext.args);
      }
    };

    ScriptView.prototype.resetView = function(title) {
      if (title == null) {
        title = 'Loading...';
      }
      if (!this.hasParent()) {
        atom.workspaceView.prependToBottom(this);
      }
      this.stop();
      this.headerView.title.text(title);
      this.headerView.setStatus('start');
      return this.output.empty();
    };

    ScriptView.prototype.close = function() {
      this.stop();
      if (this.hasParent()) {
        return this.detach();
      }
    };

    ScriptView.prototype.getLang = function(editor) {
      return editor.getGrammar().name;
    };

    ScriptView.prototype.setup = function(editor) {
      var arg, argType, buildArgsArray, commandContext, err, error, filename, filepath, lang, selection;
      commandContext = {};
      lang = this.getLang(editor);
      err = null;
      if (lang === 'Null Grammar' || lang === 'Plain Text') {
        err = $$(function() {
          return this.p('You must select a language in the lower left, or save the file with an appropriate extension.');
        });
      } else if (!(lang in grammarMap)) {
        err = $$(function() {
          this.p({
            "class": 'block'
          }, "Command not configured for " + lang + "!");
          return this.p({
            "class": 'block'
          }, (function(_this) {
            return function() {
              _this.text('Add an ');
              _this.a({
                href: "https://github.com/rgbkrk/atom-script/issues/new?title=Add%20support%20for%20" + lang
              }, 'issue on GitHub');
              return _this.text(' or send your own Pull Request.');
            };
          })(this));
        });
      }
      if (err != null) {
        this.handleError(err);
        return false;
      }
      filename = editor.getTitle();
      filepath = editor.getPath();
      selection = editor.getSelection();
      if (selection.isEmpty() && (filepath != null)) {
        argType = 'File Based';
        arg = filepath;
        editor.save();
      } else {
        argType = 'Selection Based';
        if (selection.isEmpty()) {
          arg = editor.getText();
        } else {
          arg = selection.getText();
        }
      }
      try {
        if ((this.runOptions.cmd == null) || this.runOptions.cmd === '') {
          commandContext.command = grammarMap[lang][argType].command;
        } else {
          commandContext.command = this.runOptions.cmd;
        }
        buildArgsArray = grammarMap[lang][argType].args;
        commandContext.args = buildArgsArray(arg);
      } catch (_error) {
        error = _error;
        err = $$(function() {
          this.p({
            "class": 'block'
          }, "" + argType + " runner not available for " + lang + ".");
          return this.p({
            "class": 'block'
          }, (function(_this) {
            return function() {
              _this.text('If it should exist, add an ');
              _this.a({
                href: "https://github.com/rgbkrk/atom-script/issues/new?title=Add%20support%20for%20" + lang
              }, 'issue on GitHub');
              return _this.text(', or send your own pull request.');
            };
          })(this));
        });
        this.handleError(err);
        return false;
      }
      this.headerView.title.text("" + lang + " - " + filename);
      return commandContext;
    };

    ScriptView.prototype.handleError = function(err) {
      this.headerView.title.text('Error');
      this.headerView.setStatus('err');
      this.output.append(err);
      return this.stop();
    };

    ScriptView.prototype.run = function(command, extraArgs) {
      var args, exit, options, stderr, stdout;
      atom.emit('achievement:unlock', {
        msg: 'Homestar Runner'
      });
      options = {
        cwd: this.getCwd(),
        env: process.env
      };
      args = (this.runOptions.cmdArgs.concat(extraArgs)).concat(this.runOptions.scriptArgs);
      stdout = (function(_this) {
        return function(output) {
          return _this.display('stdout', output);
        };
      })(this);
      stderr = (function(_this) {
        return function(output) {
          return _this.display('stderr', output);
        };
      })(this);
      exit = (function(_this) {
        return function(returnCode) {
          if (returnCode === 0) {
            _this.headerView.setStatus('stop');
          } else {
            _this.headerView.setStatus('err');
          }
          return console.log("Exited with " + returnCode);
        };
      })(this);
      this.bufferedProcess = new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
      return this.bufferedProcess.process.on('error', (function(_this) {
        return function(nodeError) {
          return _this.output.append($$(function() {
            this.h1('Unable to run');
            this.pre(_.escape(command));
            this.h2('Is it on your path?');
            return this.pre("PATH: " + (_.escape(process.env.PATH)));
          }));
        };
      })(this));
    };

    ScriptView.prototype.getCwd = function() {
      if ((this.runOptions.workingDirectory == null) || this.runOptions.workingDirectory === '') {
        return atom.project.getPath();
      } else {
        return this.runOptions.workingDirectory;
      }
    };

    ScriptView.prototype.stop = function() {
      if ((this.bufferedProcess != null) && (this.bufferedProcess.process != null)) {
        this.display('stdout', '^C');
        this.headerView.setStatus('kill');
        return this.bufferedProcess.kill();
      }
    };

    ScriptView.prototype.display = function(css, line) {
      line = _.escape(line);
      line = this.ansiFilter.toHtml(line);
      return this.output.append($$(function() {
        return this.pre({
          "class": "line " + css
        }, (function(_this) {
          return function() {
            return _this.raw(line);
          };
        })(this));
      }));
    };

    return ScriptView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFHQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVIsQ0FBYixDQUFBOztBQUFBLEVBQ0EsT0FBOEIsT0FBQSxDQUFRLE1BQVIsQ0FBOUIsRUFBQyxZQUFBLElBQUQsRUFBTyx1QkFBQSxlQUFQLEVBQXdCLFVBQUEsRUFEeEIsQ0FBQTs7QUFBQSxFQUVBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUZiLENBQUE7O0FBQUEsRUFHQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsdUJBQVIsQ0FIcEIsQ0FBQTs7QUFBQSxFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQUpiLENBQUE7O0FBQUEsRUFLQSxDQUFBLEdBQUksT0FBQSxDQUFRLFlBQVIsQ0FMSixDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFVBQUMsQ0FBQSxlQUFELEdBQWtCLElBQWxCLENBQUE7O0FBQUEsSUFFQSxVQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNILGNBQUEsR0FBQTtBQUFBLFVBQUEsS0FBQyxDQUFBLE9BQUQsQ0FBUyxZQUFULEVBQTJCLElBQUEsVUFBQSxDQUFBLENBQTNCLENBQUEsQ0FBQTtBQUFBLFVBR0EsR0FBQSxHQUFNLHVFQUhOLENBQUE7aUJBS0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLEdBQVA7QUFBQSxZQUFZLE1BQUEsRUFBUSxRQUFwQjtBQUFBLFlBQThCLFFBQUEsRUFBVSxDQUFBLENBQXhDO1dBQUwsRUFB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
//# sourceURL=/Users/zeke/.atom/packages/script/lib/script-view.coffee