Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// forced to disable this check for abstract methods
// jshint unused:false

var System = (function () {
  function System() {
    _classCallCheck(this, System);

    this.entities = [];
  }

  // jshint unused:true

  _createClass(System, [{
    key: "addEntity",
    value: function addEntity(entity) {
      entity.addSystem(this);
      this.entities.push(entity);

      this.enter(entity);
    }
  }, {
    key: "removeEntity",
    value: function removeEntity(entity) {
      var index = this.entities.indexOf(entity);

      if (index !== -1) {
        entity.removeSystem(this);
        this.entities.splice(index, 1);

        this.exit(entity);
      }
    }
  }, {
    key: "updateAll",
    value: function updateAll() {
      for (var i = 0, entity; entity = this.entities[i]; i += 1) {
        this.update(entity);
      }
    }

    // methods to be extended by subclasses
    /**
     * returns true if the entity should be processed by the current system
     * @param  {Entity} entity the entity to test
     */
  }, {
    key: "test",
    value: function test(entity) {
      return false;
    }

    /**
     * called when an entity is added to the system
     * @param  {Entity} entity the added entity
     */
  }, {
    key: "enter",
    value: function enter(entity) {}

    /**
     * called when an entity is removed from the system
     * @param  {Entity} entity the removed entity
     */
  }, {
    key: "exit",
    value: function exit(entity) {}

    /**
     * called for each entity to update
     * @param  {Entity} entity the entity to update
     */
  }, {
    key: "update",
    value: function update(entity) {}
  }]);

  return System;
})();

exports["default"] = System;
module.exports = exports["default"];