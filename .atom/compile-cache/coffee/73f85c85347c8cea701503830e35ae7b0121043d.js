(function() {
  module.exports = {
    CoffeeScript: {
      command: "coffee",
      "Selection Based": function(code) {
        return ['-e', code];
      },
      "File Based": function(filename) {
        return [filename];
      }
    },
    JavaScript: {
      command: "node",
      "Selection Based": function(code) {
        return ['-e', code];
      },
      "File Based": function(filename) {
        return [filename];
      }
    },
    Ruby: {
      command: "ruby",
      "Selection Based": function(code) {
        return ['-e', code];
      },
      "File Based": function(filename) {
        return [filename];
      }
    },
    Perl: {
      command: "perl",
      "Selection Based": function(code) {
        return ['-e', code];
      },
      "File Based": function(filename) {
        return [filename];
      }
    },
    PHP: {
      command: "php",
      "Selection Based": function(code) {
        return ['-r', code];
      },
      "File Based": function(filename) {
        return [filename];
      }
    },
    Python: {
      command: "python",
      "Selection Based": function(code) {
        return ['-c', code];
      },
      "File Based": function(filename) {
        return [filename];
      }
    },
    'Shell Script (Bash)': {
      command: "bash",
      "Selection Based": function(code) {
        return ['-c', code];
      },
      "File Based": function(filename) {
        return [filename];
      }
    },
    Go: {
      command: "go",
      "File Based": function(filename) {
        return ['run', filename];
      }
    },
    'F#': {
      command: "fsharpi",
      "File Based": function(filename) {
        return ['--exec', filename];
      }
    },
    newLISP: {
      command: "newlisp",
      "Selection Based": function(code) {
        return ['-e', code];
      },
      "File Based": function(filename) {
        return [filename];
      }
    },
    Haskell: {
      command: "runhaskell",
      "File Based": function(filename) {
        return [filename];
      }
    },
    Erlang: {
      command: "erl",
      "Selection Based": function(code) {
        return ['-noshell', '-eval', code + ', init:stop().'];
      }
    },
    Julia: {
      command: "julia",
      "Selection Based": function(code) {
        return ['-e', code];
      },
      "File Based": function(filename) {
        return [filename];
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBR0E7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFlBQUEsRUFDRTtBQUFBLE1BQUEsT0FBQSxFQUFTLFFBQVQ7QUFBQSxNQUNBLGlCQUFBLEVBQW1CLFNBQUMsSUFBRCxHQUFBO2VBQVUsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFWO01BQUEsQ0FEbkI7QUFBQSxNQUVBLFlBQUEsRUFBYyxTQUFDLFFBQUQsR0FBQTtlQUFjLENBQUMsUUFBRCxFQUFkO01BQUEsQ0FGZDtLQURGO0FBQUEsSUFLQSxVQUFBLEVBQ0U7QUFBQSxNQUFBLE9BQUEsRUFBUyxNQUFUO0FBQUEsTUFDQSxpQkFBQSxFQUFtQixTQUFDLElBQUQsR0FBQTtlQUFVLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBVjtNQUFBLENBRG5CO0FBQUEsTUFFQSxZQUFBLEVBQWMsU0FBQyxRQUFELEdBQUE7ZUFBYyxDQUFDLFFBQUQsRUFBZDtNQUFBLENBRmQ7S0FORjtBQUFBLElBVUEsSUFBQSxFQUNFO0FBQUEsTUFBQSxPQUFBLEVBQVMsTUFBVDtBQUFBLE1BQ0EsaUJBQUEsRUFBbUIsU0FBQyxJQUFELEdBQUE7ZUFBVSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQVY7TUFBQSxDQURuQjtBQUFBLE1BRUEsWUFBQSxFQUFjLFNBQUMsUUFBRCxHQUFBO2VBQWMsQ0FBQyxRQUFELEVBQWQ7TUFBQSxDQUZkO0tBWEY7QUFBQSxJQWVBLElBQUEsRUFDRTtBQUFBLE1BQUEsT0FBQSxFQUFTLE1BQVQ7QUFBQSxNQUNBLGlCQUFBLEVBQW1CLFNBQUMsSUFBRCxHQUFBO2VBQVUsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFWO01BQUEsQ0FEbkI7QUFBQSxNQUVBLFlBQUEsRUFBYyxTQUFDLFFBQUQsR0FBQTtlQUFjLENBQUMsUUFBRCxFQUFk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
//# sourceURL=/Users/zeke/.atom/packages/script/lib/grammars.coffee