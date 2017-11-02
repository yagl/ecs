Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/**
 * @module  ecs
 */

var _utils = require('./utils');

// forced to disable this check for abstract methods
// jshint unused:false
/**
 * @class  System
 *
 * @description  A system update all eligible entities at a given frequency.
 * This class is not meant to be used directly and should be sub-classed to
 * define specific logic.
 */

var System = (function () {
  /**
   * @class  System
   * @constructor
   * @param [frequency=1] {Number} Frequency of execution.
   */

  function System() {
    var frequency = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

    _classCallCheck(this, System);

    /**
     * Frequency of update execution, a frequency of `1` run the system every
     * update, `2` will run the system every 2 updates, ect.
     * @property {Number} frequency
     */
    this.frequency = frequency;

    /**
     * Entities of the system.
     *
     * @property {Array[Entity]} entities
     */
    this.entities = [];
    this.enable();
  }

  // jshint unused:true

  /**
   * Add an entity to the system entities.
   *
   * @param {Entity} entity The entity to add to the system.
   */

  _createClass(System, [{
    key: 'addEntity',
    value: function addEntity(entity) {
      entity.addSystem(this);
      this.entities.push(entity);

      this.enter(entity);
    }

    /**
     * Enable this system.
     *
     * @method  disable
     */
  }, {
    key: 'disable',
    value: function disable() {
      this.enabled = false;
    }

    /**
     * Disable this system.
     *
     * @method  enable
     */
  }, {
    key: 'enable',
    value: function enable() {
      this.enabled = true;
    }

    /**
     * Remove an entity from the system entities. exit() handler is executed
     * only if the entity actually exists in the system entities.
     *
     * @param  {Entity} entity Reference of the entity to remove.
     */
  }, {
    key: 'removeEntity',
    value: function removeEntity(entity) {
      var index = this.entities.indexOf(entity);

      if (index !== -1) {
        entity.removeSystem(this);
        (0, _utils.fastSplice)(this.entities, index, 1);

        this.exit(entity);
      }
    }

    /**
     * Apply update to each entity of this system.
     *
     * @method  updateAll
     */
  }, {
    key: 'updateAll',
    value: function updateAll(elapsed) {
      this.preUpdate();

      for (var i = 0, entity = undefined; entity = this.entities[i]; i += 1) {
        this.update(entity, elapsed);
      }

      this.postUpdate();
    }

    /**
     * dispose the system by exiting all the entities
     *
     * @method  dispose
     */
  }, {
    key: 'dispose',
    value: function dispose() {
      for (var i = 0, entity = undefined; entity = this.entities[i]; i += 1) {
        entity.removeSystem(this);
        this.exit(entity);
      }
    }

    // methods to be extended by subclasses
    /**
     * Abstract method to subclass. Called once per update, before entities
     * iteration.
     *
     * @method  preUpdate
     */
  }, {
    key: 'preUpdate',
    value: function preUpdate() {}

    /**
     * Abstract method to subclass. Called once per update, after entities
     * iteration.
     *
     * @method  postUpdate
     */
  }, {
    key: 'postUpdate',
    value: function postUpdate() {}

    /**
     * Abstract method to subclass. Should return true if the entity is eligible
     * to the system, false otherwise.
     *
     * @method  test
     * @param  {Entity} entity The entity to test.
     */
  }, {
    key: 'test',
    value: function test(entity) {
      return false;
    }

    /**
     * Abstract method to subclass. Called when an entity is added to the system.
     *
     * @method  enter
     * @param  {Entity} entity The added entity.
     */
  }, {
    key: 'enter',
    value: function enter(entity) {}

    /**
     * Abstract method to subclass. Called when an entity is removed from the system.
     *
     * @method  exit
     * @param  {Entity} entity The removed entity.
     */
  }, {
    key: 'exit',
    value: function exit(entity) {}

    /**
     * Abstract method to subclass. Called for each entity to update. This is
     * the only method that should actual mutate entity state.
     *
     * @method  update
     * @param  {Entity} entity The entity to update.
     */
  }, {
    key: 'update',
    value: function update(entity) {}
  }]);

  return System;
})();

exports['default'] = System;
module.exports = exports['default'];