/**
 * @module  ecs
 */

import {UIDGenerator, DefaultUIDGenerator} from './uid';

/**
 * An entity.
 * 
 * @class  Entity
 */
class Entity {
  /**
   * @class Entity
   * @constructor
   * 
   * @param  {Number|UIDGenerator} [idOrUidGenerator=null] The entity id if
   * a Number is passed. If an UIDGenerator is passed, the entity will use
   * it to generate a new id. If nothing is passed, the entity will use
   * the default UIDGenerator.
   *
   * @param {Array[Component]} [components=[]] An array of initial components.
   */
  constructor(idOrUidGenerator, components = []) {
    /**
     * Unique identifier of the entity.
     * 
     * @property {Number} id
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
     * Systems applied to the entity.
     * 
     * @property {Array[System]} systems
     */
    this.systems = [];

    /**
     * Indiquate a change in components (a component was removed or added)
     * which require to re-compute entity eligibility to all systems.
     * 
     * @property {Boolean} systemsDirty
     */
    this.systemsDirty = false;

    /**
     * Components of the entity stored as key-value pairs.
     * 
     * @property {Object} components
     */
    this.components = {};

    // components initialisation
    for (let i = 0, component; component = components[i]; i += 1) {
      // if a getDefaults method is provided, use it. First because let the
      // runtime allocate the component is way more faster than using a copy
      // function. Secondly because the user may want to provide some kind
      // of logic in components initialisation ALTHOUGH these kind of 
      // initialisation should be done in enter() handler
      if (component.getDefaults) {
        this.components[component.name] = component.getDefaults();
      } else {
        this.components[component.name] = Object.assign({}, 
          components[i].defaults);
      }
    }

    /**
     * A reference to parent ECS class.
     * @property {ECS} ecs
     */
    this.ecs = null;
  }
  /**
   * Set the parent ecs reference.
   *
   * @private
   * @param {ECS} ecs An ECS class instance.
   */
  addToECS(ecs) {
    this.ecs = ecs;
    this.setSystemsDirty();
  }
  /**
   * Set the systems dirty flag so the ECS knows this entity 
   * needs to recompute eligibility at the beginning of next 
   * tick.
   */
  setSystemsDirty() {
    if (!this.systemsDirty && this.ecs) {
      this.systemsDirty = true;

      // notify to parent ECS that this entity needs to be tested next tick
      this.ecs.entitiesSystemsDirty.push(this);
    }
  }
  /**
   * Add a system to the entity.
   *
   * @private
   * @param {System} system The system to add.
   */
  addSystem(system) {
    this.systems.push(system);
  }
  /**
   * Remove a system from the entity.
   *
   * @private
   * @param  {System} system The system reference to remove.
   */
  removeSystem(system) {
    let index = this.systems.indexOf(system);

    if (index !== -1) {
      this.systems.splice(index, 1);
    }
  }
  /**
   * Add a component to the entity. WARNING this method does not copy
   * components data but assign directly the reference for maximum
   * performances. Be sure not to pass the same component reference to
   * many entities.
   * 
   * @param {String} name Attribute name of the component to add.
   * @param {Object} data Component data.
   */
  addComponent(name, data) {
    this.components[name] = data || {};
    this.setSystemsDirty();
  }
  /**
   * Remove a component from the entity. To preserve performances, we 
   * simple set the component property to `undefined`. Therefore the 
   * property is still enumerable after a call to removeComponent()
   * 
   * @param  {String} name Name of the component to remove.
   */
  removeComponent(name) {
    if (!this.components[name]) {
      return;
    }

    this.components[name] = undefined;
    this.setSystemsDirty();
  }
  /**
   * Update a component field by field, NOT recursively. If the component
   * does not exists, this method create it silently.
   * 
   * @method updateComponent
   * @param  {String} name Name of the component
   * @param  {Object} data Dict of attributes to update
   * @example
   *   entity.addComponent('kite', {vel: 0, pos: {x: 1}});
   *   // entity.component.pos is '{vel: 0, pos: {x: 1}}'
   *   entity.updateComponent('kite', {angle: 90, pos: {y: 1}});
   *   // entity.component.pos is '{vel: 0, angle: 90, pos: {y: 1}}'
   */
  updateComponent(name, data) {
    let component = this.components[name];

    if (!component) {
      this.addComponent(name, data);
    } else {
      let keys = Object.keys(data);

      for (let i = 0, key; key = keys[i]; i += 1) {
        component[key] = data[key];
      }
    }
  }
  /**
   * Update a set of components.
   * 
   * @param  {Object} componentsData Dict of components to update.
   */
  updateComponents(componentsData) {
    let components = Object.keys(componentsData);

    for (let i = 0, component; component = components[i]; i += 1) {
      this.updateComponent(component, componentsData[component]);
    }
  }
  /**
   * Dispose the entity.
   *
   * @private
   */
  dispose() {
    for (var i = 0, system; system = this.systems[0]; i += 1) {
      system.removeEntity(this);
    }
  }
}

export default Entity;