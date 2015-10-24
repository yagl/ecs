
/*global global */

var root = global || window;

if (!root.performance) {
  root.performance = {
    now: function now() {
      return Date.now();
    }
  };
}