
import System from '../../src/system';

function getFakeEntity() {
  return {
    addSystem: sinon.spy(),
    removeSystem: sinon.spy()
  };
}

describe('System', () => {
  it('should initialize', () => {
    let system = new System();
    expect(system).to.exist;
  });

  describe('addEntity()', () => {
    let entity, system;

    beforeEach(() => {
      entity = getFakeEntity();
      system = new System();
    });

    it('should add an entity to the system', () => {
      system.addEntity(entity);

      expect(system.entities.length).to.be.equal(1);
    });

    it('should add the system to entity systems', () => {
      system.addEntity(entity);

      expect(entity.addSystem.calledWith(system)).to.be.equal(true);
    });

    it('should call enter() on added entity', () => {
      system.enter = sinon.spy();

      system.addEntity(entity);

      expect(system.enter.calledWith(entity)).to.be.equal(true);
    });
  });

  describe('removeEntity()', () => {
    let entity, system;

    beforeEach(() => {
      entity = getFakeEntity();
      system = new System();

      system.addEntity(entity);
    });

    it('should remove an entity from the system', () => {
      system.removeEntity(entity);

      expect(system.entities.length).to.be.equal(0);
    });

    it('should remove the system from entity systems', () => {
      system.removeEntity(entity);

      expect(entity.removeSystem.calledWith(system)).to.be.equal(true);
    });

    it('should call exit() on removed entity', () => {
      system.exit = sinon.spy();

      system.removeEntity(entity);

      expect(system.exit.calledWith(entity)).to.be.equal(true);
    });
  });

  describe('updateAll()', () => {
    it('should call update() on each entity', () => {
      let entity1 = getFakeEntity();
      let entity2 = getFakeEntity();
      let system = new System();
      system.update = sinon.spy();

      system.addEntity(entity1);
      system.addEntity(entity2);
      system.updateAll();

      expect(system.update.calledTwice).to.be.equal(true);
      expect(system.update.calledWith(entity1)).to.be.equal(true);      
      expect(system.update.calledWith(entity2)).to.be.equal(true);      
    });
  });
});
