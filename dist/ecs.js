Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/**
 * Entity Component System module
 *
 * @module ecs
 */

var _entity = require('./entity');

var _entity2 = _interopRequireDefault(_entity);

var _system = require('./system');

var _system2 = _interopRequireDefault(_system);

var _performance = require('./performance');

var _performance2 = _interopRequireDefault(_performance);

var _uid = require('./uid');

var _uid2 = _interopRequireDefault(_uid);

/**
 * @class  ECS
 */

var ECS = (function () {
  /**
   * @constructor
   * @class  ECS
   */

  function ECS() {
    _classCallCheck(this, ECS);

    /**
     * Store all entities of the ECS.
     *
     * @property entities
     * @type {Array}
     */
    this.entities = [];

    /**
     * Store entities which need to be tested at beginning of next tick.
     *
     * @property entitiesSystemsDirty
     * @type {Array}
     */
    this.entitiesSystemsDirty = [];

    /**
     * Store all systems of the ECS.
     *
     * @property systems
     * @type {Array}
     */
    this.systems = [];

    /**
     * Count how many updates have been done.
     *
     * @property updateCounter
     * @type {Number}
     */
    this.updateCounter = 0;

    this.lastUpdate = _performance2['default'].now();
  }

  // expose user stuff

  /**
   * Retrieve an entity by id
   * @param  {Number} id id of the entity to retrieve
   * @return {Entity} The entity if found null otherwise
   */

  _createClass(ECS, [{
    key: 'getEntityById',
    value: function getEntityById(id) {
      for (var i = 0, entity = undefined; entity = this.entities[i]; i += 1) {
        if (entity.id === id) {
          return entity;
        }
      }

      return null;
    }

    /**
     * Add an entity to the ecs.
     *
     * @method addEntity
     * @param {Entity} entity The entity to add.
     */
  }, {
    key: 'addEntity',
    value: function addEntity(entity) {
      this.entities.push(entity);
      entity.addToECS(this);
    }

    /**
     * Remove an entity from the ecs by reference.
     *
     * @method removeEntity
     * @param  {Entity} entity reference of the entity to remove
     * @return {Entity}        the remove entity if any
     */
  }, {
    key: 'removeEntity',
    value: function removeEntity(entity) {
      var index = this.entities.indexOf(entity);
      var entityRemoved = null;

      // if the entity is not found do nothing
      if (index !== -1) {
        entityRemoved = this.entities[index];

        entity.dispose();
        this.removeEntityIfDirty(entityRemoved);
        this.entities.splice(index, 1);
      }

      return entityRemoved;
    }

    /**
     * Remove an entity from the ecs by entity id.
     *
     * @method removeEntityById
     * @param  {Entity} entityId id of the entity to remove
     * @return {Entity}          removed entity if any
     */
  }, {
    key: 'removeEntityById',
    value: function removeEntityById(entityId) {
      for (var i = 0, entity = undefined; entity = this.entities[i]; i += 1) {
        if (entity.id === entityId) {
          entity.dispose();
          this.removeEntityIfDirty(entity);
          this.entities.splice(i, 1);

          return entity;
        }
      }
    }

    /**
     * Remove an entity from dirty entities by reference.
     *
     * @private
     * @method removeEntityIfDirty
     * @param  {[type]} entity entity to remove
     */
  }, {
    key: 'removeEntityIfDirty',
    value: function removeEntityIfDirty(entity) {
      var index = this.entitiesSystemsDirty.indexOf(entity);

      if (index !== -1) {
        this.entitiesSystemsDirty.splice(index, 1);
      }
    }

    /**
     * Add a system to the ecs.
     *
     * @method addSystem
     * @param {System} system system to add
     */
  }, {
    key: 'addSystem',
    value: function addSystem(system) {
      this.systems.push(system);

      // iterate over all entities to eventually add system
      for (var i = 0, entity = undefined; entity = this.entities[i]; i += 1) {
        if (system.test(entity)) {
          system.addEntity(entity);
        }
      }
    }

    /**
     * Remove a system from the ecs.
     *
     * @method removeSystem
     * @param  {System} system system reference
     */
  }, {
    key: 'removeSystem',
    value: function removeSystem(system) {
      var index = this.systems.indexOf(system);

      if (index !== -1) {
        this.systems.splice(index, 1);
        system.dispose();
      }
    }

    /**
     * "Clean" entities flagged as dirty by removing unecessary systems and
     * adding missing systems.
     *
     * @private
     * @method cleanDirtyEntities
     */
  }, {
    key: 'cleanDirtyEntities',
    value: function cleanDirtyEntities() {
      // jshint maxdepth: 4

      for (var i = 0, entity = undefined; entity = this.entitiesSystemsDirty[i]; i += 1) {
        for (var s = 0, system = undefined; system = this.systems[s]; s += 1) {
          // for each dirty entity for each system
          var index = entity.systems.indexOf(system);
          var entityTest = system.test(entity);

          if (index === -1 && entityTest) {
            // if the entity is not added to the system yet and should be, add it
            system.addEntity(entity);
          } else if (index !== -1 && !entityTest) {
            // if the entity is added to the system but should not be, remove it
            system.removeEntity(entity);
          }
          // else we do nothing the current state is OK
        }

        entity.systemsDirty = false;
      }
      // jshint maxdepth: 3

      this.entitiesSystemsDirty = [];
    }

    /**
     * Update the ecs.
     *
     * @method update
     */
  }, {
    key: 'update',
    value: function update() {
      var now = _performance2['default'].now();
      var elapsed = now - this.lastUpdate;

      for (var i = 0, system = undefined; system = this.systems[i]; i += 1) {
        if (this.updateCounter % system.frequency > 0) {
          break;
        }

        if (this.entitiesSystemsDirty.length) {
          // if the last system flagged some entities as dirty check that case
          this.cleanDirtyEntities();
        }

        system.updateAll(elapsed);
      }

      this.updateCounter += 1;
      this.lastUpdate = now;
    }
  }]);

  return ECS;
})();

ECS.Entity = _entity2['default'];
ECS.System = _system2['default'];
ECS.uid = _uid2['default'];

exports['default'] = ECS;
module.exports = exports['default'];