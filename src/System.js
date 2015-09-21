
// forced to disable this check for abstract methods
// jshint unused:false
class System {
  constructor() {
    this.entities = [];
  }
  addEntity(entity) {
    entity.addSystem(this);
    this.entities.push(entity);

    this.enter(entity);
  }
  removeEntity(entity) {
    let index = this.entities.indexOf(entity);

    if (index !== -1) {
      entity.removeSystem(this);
      this.entities.splice(index, 1);

      this.exit(entity);
    }
  }
  updateAll() {
    for (var i = 0, entity; entity = this.entities[i]; i += 1) {
      this.update(entity);
    }
  }
  // methods to be extended by subclasses
  /**
   * returns true if the entity should be processed by the current system
   * @param  {Entity} entity the entity to test
   */
  test(entity) {
    return false;
  }
  /**
   * called when an entity is added to the system
   * @param  {Entity} entity the added entity
   */
  enter(entity) {}
  /**
   * called when an entity is removed from the system
   * @param  {Entity} entity the removed entity
   */
  exit(entity) {}
  /**
   * called for each entity to update
   * @param  {Entity} entity the entity to update
   */
  update(entity) {}
}
// jshint unused:true

export default System;