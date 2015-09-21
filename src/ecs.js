
class ECS {
  constructor() {
    this.entities = [];

    /**
     * store entities which need to be tested at beginning of next tick
     * @type {Array}
     */
    this.entitiesSystemsDirty = [];
    this.systems = [];
    this.updateCounter = 0;
  }
  addEntity(entity) {
    this.entities.push(entity);
    entity.addToECS(this);
  }
  removeEntity(entity) {
    let index = this.entities.indexOf(entity);
    let entityRemoved = null;

    if (index !== -1) {
      entityRemoved = this.entities[index];

      entity.dispose();
      this.removeEntityIfDirty(entityRemoved);
      this.entities.splice(index, 1);
    }

    return entityRemoved;
  }
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
  removeEntityIfDirty(entity) {
    let index = this.entitiesSystemsDirty.indexOf(entity);

    if (index !== -1) {
      this.entitiesSystemsDirty.splice(index, 1);
    }
  }
  /*disposeEntity(entity) {
    let entityRemoved = this.removeEntity(entity);

    if (entityRemoved) {
      entityRemoved.dispose();
    }
  }
  disposeEntityById(entityId) {
    let entityRemoved = this.removeEntityById(entityId);

    if (entityRemoved) {
      entityRemoved.dispose();
    }
  }*/
  addSystem(system) {
    this.systems.push(system);
  }
  removeSystem(system) {
    let index = this.systems.indexOf(system);

    if (index !== -1) {
      this.systems.splice(index, 1);
    }
  }
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
    }
    // jshint maxdepth: 3

    this.entitiesSystemsDirty = [];
  }
  update() {
    for (let i = 0, system; system = this.systems[i]; i += 1) {
      if (this.updateCounter % system.frequency > 0) {
        break;
      }

      if (this.entitiesSystemsDirty) {
        // if the last system flagged some entities as dirty check that case
        this.cleanDirtyEntities();
      }

      system.updateAll();
    }

    this.updateCounter += 1;
  }
}

export default ECS;
