Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @module  uid
 */
/*
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

/**
 * Generate unique sequences of Numbers. Can be salted (up to 9999 salts)
 * to generate differents ids.
 *
 * To work properly, ECS needs to associate an unique id with each entity. But
 * to preserve efficiency, the unique id must be a Number (more exactly a safe 
 * integer).
 *
 * The basic implementation would be an incremented Number to generate a unique
 * sequence, but this fails when several ecs instances are running and creating
 * entities concurrently (e.g. in a multiplayer networked game). To work around
 * this problem, ecs provide UIDGenerator class which allow you to salt your 
 * generated ids sequence. Two generators with different salts will NEVER 
 * generate the same ids.
 *
 * Currently, there is a maxumum of 9999 salts and about 900719925473 uid per
 * salt. These limits are hard-coded, but I plan to expose these settings in
 * the future.
 * 
 * @class  UIDGenerator
 */

var UIDGenerator = (function () {
  /**
   * @constructor
   * @class  UIDGenerator
   * @param  {Number} [salt=0] The salt to use for this generator. Number 
   * between 0 and 9999 (inclusive).
   */

  function UIDGenerator() {
    var salt = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

    _classCallCheck(this, UIDGenerator);

    /**
     * The salt of this generator.
     * @property {Number} salt
     */
    this.salt = salt;

    /**
     * The counter used to generate unique sequence.
     * @property {Number} uidCount
     */
    this.uidCounter = 0;
  }

  /**
   * @class UID
   */

  /**
   * Create a new unique id.
   * 
   * @return {Number} An unique id.
   */

  _createClass(UIDGenerator, [{
    key: "next",
    value: function next() {
      var nextUid = this.salt + this.uidCounter * MAX_SALTS;

      // if we exceed the number of maximum entities (which is
      // very high) reset the counter.
      if (++this.uidCounter >= MAX_ENTITY_PER_GENERATOR) {
        this.uidCounter = 0;
      }

      return nextUid;
    }
  }]);

  return UIDGenerator;
})();

var UID = {
  /**
   * A reference to UIDGenerator class.
   * 
   * @property {class} UIDGenerator
   */
  UIDGenerator: UIDGenerator,
  /**
   * The default generator to use if an entity is created without id or generator instance.
   * 
   * @property {UIDGenerator} DefaultUIDGenerator
   */
  DefaultUIDGenerator: new UIDGenerator(currentSalt++),
  /**
   * Return the next unique salt.
   *
   * @method  nextSalt
   * @return {Number} A unique salt.
   */
  nextSalt: function nextSalt() {
    var salt = currentSalt;

    // if we exceed the number of maximum salts, silently reset
    // to 1 (since 0 will always be the default generator)
    if (++currentSalt > MAX_SALTS - 1) {
      currentSalt = 1;
    }

    return salt;
  },
  /**
   * Create a new generator with unique salt.
   *
   * @method  nextGenerator
   * @return {UIDGenerator} The created UIDGenerator.
   */
  nextGenerator: function nextGenerator() {
    return new UIDGenerator(UID.nextSalt());
  }
};

exports["default"] = UID;
module.exports = exports["default"];