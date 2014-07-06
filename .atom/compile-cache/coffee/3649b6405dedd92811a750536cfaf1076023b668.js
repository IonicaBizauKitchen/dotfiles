(function() {
  var Crypto, EditorView, Firebase, Firepad, FirepadView, ShareView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Crypto = require('crypto');

  _ref = require('atom'), View = _ref.View, EditorView = _ref.EditorView;

  Firebase = require('firebase');

  Firepad = require('./firepad-lib');

  ShareView = (function(_super) {
    __extends(ShareView, _super);

    function ShareView() {
      return ShareView.__super__.constructor.apply(this, arguments);
    }

    ShareView.content = function() {
      return this.div({
        "class": 'firepad overlay from-bottom'
      }, (function(_this) {
        return function() {
          return _this.div('This file is being shared', {
            "class": 'message'
          });
        };
      })(this));
    };

    ShareView.prototype.show = function() {
      return atom.workspaceView.append(this);
    };

    return ShareView;

  })(View);

  module.exports = FirepadView = (function(_super) {
    __extends(FirepadView, _super);

    function FirepadView() {
      return FirepadView.__super__.constructor.apply(this, arguments);
    }

    FirepadView.activate = function() {
      return new FirepadView;
    };

    FirepadView.content = function() {
      return this.div({
        "class": 'firepad overlay from-top mini'
      }, (function(_this) {
        return function() {
          _this.subview('miniEditor', new EditorView({
            mini: true
          }));
          return _this.div({
            "class": 'message',
            outlet: 'message'
          });
        };
      })(this));
    };

    FirepadView.prototype.detaching = false;

    FirepadView.prototype.initialize = function() {
      atom.workspaceView.command('firepad:share', (function(_this) {
        return function() {
          return _this.share();
        };
      })(this));
      atom.workspaceView.command('firepad:unshare', (function(_this) {
        return function() {
          return _this.unshare();
        };
      })(this));
      this.miniEditor.hiddenInput.on('focusout', (function(_this) {
        return function() {
          if (!_this.detaching) {
            return _this.detach();
          }
        };
      })(this));
      this.on('core:confirm', (function(_this) {
        return function() {
          return _this.confirm();
        };
      })(this));
      this.on('core:cancel', (function(_this) {
        return function() {
          return _this.detach();
        };
      })(this));
      return this.miniEditor.preempt('textInput', (function(_this) {
        return function(e) {
          if (!e.originalEvent.data.match(/[a-zA-Z0-9\-]/)) {
            return false;
          }
        };
      })(this));
    };

    FirepadView.prototype.detach = function() {
      if (!this.hasParent()) {
        return;
      }
      this.detaching = true;
      this.miniEditor.setText('');
      FirepadView.__super__.detach.apply(this, arguments);
      return this.detaching = false;
    };

    FirepadView.prototype.share = function() {
      var editor;
      if (editor = atom.workspace.getActiveEditor()) {
        atom.workspaceView.append(this);
        this.message.text('Enter a string to identify this share session');
        return this.miniEditor.focus();
      }
    };

    FirepadView.prototype.confirm = function() {
      var editor, hash, shareId;
      shareId = this.miniEditor.getText();
      hash = Crypto.createHash('sha256').update(shareId).digest('base64');
      this.detach();
      this.ref = new Firebase('https://atom-firepad.firebaseio.com').child(hash);
      editor = atom.workspace.getActiveEditor();
      return this.ref.once('value', (function(_this) {
        return function(snapshot) {
          var options;
          options = {
            sv_: Firebase.ServerValue.TIMESTAMP
          };
          if (!snapshot.val() && editor.getText() !== '') {
            options.overwrite = true;
          } else {
            editor.setText('');
          }
          _this.pad = Firepad.fromAtom(_this.ref, editor, options);
          _this.view = new ShareView();
          return _this.view.show();
        };
      })(this));
    };

    FirepadView.prototype.unshare = function() {
      this.pad.dispose();
      return this.view.detach();
    };

    return FirepadView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLHlFQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FBVCxDQUFBOztBQUFBLEVBQ0EsT0FBcUIsT0FBQSxDQUFRLE1BQVIsQ0FBckIsRUFBQyxZQUFBLElBQUQsRUFBTyxrQkFBQSxVQURQLENBQUE7O0FBQUEsRUFHQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFVBQVIsQ0FIWCxDQUFBOztBQUFBLEVBSUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxlQUFSLENBSlYsQ0FBQTs7QUFBQSxFQU1NO0FBQ0osZ0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsU0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sNkJBQVA7T0FBTCxFQUEyQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUN6QyxLQUFDLENBQUEsR0FBRCxDQUFLLDJCQUFMLEVBQWtDO0FBQUEsWUFBQSxPQUFBLEVBQU8sU0FBUDtXQUFsQyxFQUR5QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNDLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsd0JBSUEsSUFBQSxHQUFNLFNBQUEsR0FBQTthQUNKLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBbkIsQ0FBMEIsSUFBMUIsRUFESTtJQUFBLENBSk4sQ0FBQTs7cUJBQUE7O0tBRHNCLEtBTnhCLENBQUE7O0FBQUEsRUFjQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osa0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsV0FBQyxDQUFBLFFBQUQsR0FBVyxTQUFBLEdBQUE7YUFBRyxHQUFBLENBQUEsWUFBSDtJ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
//# sourceURL=/Users/zeke/.atom/packages/firepad/lib/firepad.coffee