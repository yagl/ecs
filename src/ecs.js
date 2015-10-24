/**
 * Entity Component System module
 *
 * @module ecs
 */

/*global performance*/

import './polyfill';

import Entity from './entity';
import System from './system';
import uid from './uid';

/**
 * @class  ECS
 */
class ECS {
  /**
   * @constructor
   * @class  ECS
   */
  constructor() {
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

    this.lastUpdate = performance.now();
  }
  /**
   * Add an entity to the ecs.
   *
   * @method addEntity
   * @param {Entity} entity The entity to add.
   */
  addEntity(entity) {
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
  removeEntity(entity) {
    let index = this.entities.indexOf(entity);
    let entityRemoved = null;

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
  removeEntityById(entityId) {
    for (let i = 0, entity; entity = this.entities[i]; i += 1) {
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
  removeEntityIfDirty(entity) {
    let index = this.entitiesSystemsDirty.indexOf(entity);

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
  addSystem(system) {
    this.systems.push(system);

    // iterate over all entities to eventually add system
    for (let i = 0, entity; entity = this.entities[i]; i += 1) {
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
  removeSystem(system) {
    let index = this.systems.indexOf(system);

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
  cleanDirtyEntities() {
    // jshint maxdepth: 4

    for (let i = 0, entity; entity = this.entitiesSystemsDirty[i]; i += 1) {
      for (let s = 0, system; system = this.systems[s]; s += 1) {
        // for each dirty entity for each system
        let index = entity.systems.indexOf(system);
        let entityTest = system.test(entity);

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
  update() {
    let now = performance.now();
    let elapsed = now - this.lastUpdate;

    for (let i = 0, system; system = this.systems[i]; i += 1) {
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
}

// expose user stuff
ECS.Entity = Entity;
ECS.System = System;
ECS.uid = uid;

export default ECS;
