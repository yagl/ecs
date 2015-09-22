Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _uid = require('./uid');

var _utils = require('./utils');

var Entity = (function () {
  function Entity(idOrUidGenerator) {
    _classCallCheck(this, Entity);

    /**
     * unique identifier of the entity
     * @type {Number}
     */
    this.id = null;

    // initialize id depending on what is the first argument
    if (typeof idOrUidGenerator === 'number') {
      // if a number was passed then simply set it as id
      this.id = idOrUidGenerator;
    } else if (idOrUidGenerator instanceof _uid.UIDGenerator) {
      // if an instance of UIDGenerator was passed then use it to generate
      // the id. This allow the user to use multiple UID generators and
      // therefore to create entities with unique ids accross a cluster
      // or an async environment. See uid.js for more details
      this.id = idOrUidGenerator.next();
    } else {
      // if nothing was passed simply use the default generator
      this.id = _uid.DefaultUIDGenerator.next();
    }

    /**
     * Systems applied each update to the entity
     * @type {Array[System]}
     */
    this.systems = [];

    /**
     * if true the systems are computed again at the beginning of the next ecs tick
     * @type {Boolean}
     */
    this.systemsDirty = true;

    /**
     * components of the entity
     * @type {Object|Number|String}
     */
    this.components = {};

    /**
     * a reference to parent ECS class
     * @type {ECS}
     */
    this.ecs = null;
  }

  _createClass(Entity, [{
    key: 'addToECS',
    value: function addToECS(ecs) {
      this.ecs = ecs;
    }
  }, {
    key: 'setSystemsDirty',
    value: function setSystemsDirty() {
      if (!this.systemsDirty) {
        this.systemsDirty = true;

        // notify to parent ECS that this entity needs to be tested next tick
        this.ecs.entitiesSystemsDirty.push(this);
      }
    }
  }, {
    key: 'addSystem',
    value: function addSystem(system) {
      this.systems.push(system);
    }
  }, {
    key: 'removeSystem',
    value: function removeSystem(system) {
      var index = this.systems.indexOf(system);

      if (index !== -1) {
        this.systems.splice(index, 1);
      }
    }
  }, {
    key: 'addComponent',
    value: function addComponent(Component) {
      if (this.components[Component.name]) {
        throw new Error('component \'' + name + '\' already not exists');
      }

      this.components[Component.name] = new Component();
      this.setSystemsDirty();
    }
  }, {
    key: 'applyComponentMixins',
    value: function applyComponentMixins(Component) {
      if (!Component.mixins) {
        return false;
      }

      for (var i = 0, mixin; mixin = Component.mixins[i]; i += 1) {
        this[mixin.name] = (0, _utils.fastBind)(this, mixin.method);
      }
    }
  }, {
    key: 'removeComponent',
    value: function removeComponent(Component) {
      if (!this.components[Component.name]) {
        return;
      }

      this.components[name] = undefined;
      this.setSystemsDirty();
    }
  }, {
    key: 'removeComponentMixins',
    value: function removeComponentMixins(Component) {
      if (!Component.mixins) {
        return false;
      }

      for (var i = 0, mixin; mixin = Component.mixins[i]; i += 1) {
        this[mixin.name] = undefined;
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      for (var i = 0, system; system = this.systems[i]; i += 1) {
        system.removeEntity(this);
      }
    }
  }]);

  return Entity;
})();

exports['default'] = Entity;
module.exports = exports['default'];