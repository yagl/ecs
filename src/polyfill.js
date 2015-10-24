
/*global global */

let root = global || window;

if (!root.performance) {
  root.performance = {
    now: () => Date.now()
  };
}
