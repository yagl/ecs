Object.defineProperty(exports, "__esModule", {
  value: true
});

/*global global */

var perf = null,
    start = Date.now();

// use global browser performance module
// for node create a polyfill
if (!global) {
  perf = window.performance;
} else {
  perf = {
    now: function now() {
      return Date.now() - start;
    }
  };
}

exports["default"] = perf;
module.exports = exports["default"];