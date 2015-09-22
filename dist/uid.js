Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * UIDGenerator for multi-instance Entity Component System
 * Generate numeric unique ids for ECS entities. The requirements are:
 *  * generate Numbers for fast comparaison, low storage and bandwidth usage
 *  * generators can be salted so you can use multiple generators with 
 *  uniqueness guaranty
 *  * each salted generator can generate reasonable amount of unique ids
 */

// maximum number of salted generators that can run concurently, once the
// number of allowed generators has been reached the salt of the next
// generator is silently reset to 0
var MAX_SALTS = 10000;

var MAX_ENTITY_PER_GENERATOR = Math.floor(Number.MAX_SAFE_INTEGER / MAX_SALTS) - 1;
var currentSalt = 0;

var UIDGenerator = (function () {
  function UIDGenerator() {
    var salt = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

    _classCallCheck(this, UIDGenerator);

    this.salt = salt;
    this.uidCounter = 0;
  }

  _createClass(UIDGenerator, [{
    key: "next",
    value: function next() {
      var nextUid = this.salt + this.uidCounter * MAX_SALTS;

      if (++this.uidCounter >= MAX_ENTITY_PER_GENERATOR) {
        this.uidCounter = 0;
      }

      return nextUid;
    }
  }]);

  return UIDGenerator;
})();

var GeneratorManager = {
  UIDGenerator: UIDGenerator,
  DefaultUIDGenerator: new UIDGenerator(currentSalt++),
  nextGenerator: function nextGenerator() {
    return new UIDGenerator(currentSalt++);
  },
  nextGeneratorSalt: function nextGeneratorSalt() {
    return currentSalt++;
  }
};

exports["default"] = GeneratorManager;
module.exports = exports["default"];