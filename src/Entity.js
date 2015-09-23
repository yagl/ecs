
import {UIDGenerator, DefaultUIDGenerator} from './uid';
import {fastBind} from './utils';

class Entity {
  constructor(idOrUidGenerator) {
    /**
     * unique identifier of the entity
     * @type {Number}
     */
    this.id = null;

    // initialize id depending on what is the first argument
    if (typeof idOrUidGenerator === 'number') {
      // if a number was passed then simply set it as id
      this.id = idOrUidGenerator;
    } else if (idOrUidGenerator instanceof UIDGenerator) {
      // if an instance of UIDGenerator was passed then use it to generate
      // the id. This allow the user to use multiple UID generators and 
      // therefore to create entities with unique ids accross a cluster
      // or an async environment. See uid.js for more details
      this.id = idOrUidGenerator.next();
    } else {
      // if nothing was passed simply use the default generator
      this.id = DefaultUIDGenerator.next();
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
  addToECS(ecs) {
    this.ecs = ecs;
  }
  setSystemsDirty() {
    if (!this.systemsDirty) {
      this.systemsDirty = true;

      // notify to parent ECS that this entity needs to be tested next tick
      this.ecs.entitiesSystemsDirty.push(this);
    }
  }
  addSystem(system) {
    this.systems.push(system);
  }
  removeSystem(system) {
    let index = this.systems.indexOf(system);

    if (index !== -1) {
      this.systems.splice(index, 1);
    }
  }
  addComponent(name, data) {
    this.components[name] = data || {};
    this.setSystemsDirty();
  }
  removeComponent(name) {
    if (!this.components[name]) {
      return;
    }

    this.components[name] = undefined;
    this.setSystemsDirty();
  }
  dispose() {
    for (var i = 0, system; system = this.systems[i]; i += 1) {
      system.removeEntity(this);
    }
  }
}

export default Entity;