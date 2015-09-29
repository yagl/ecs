import ECS from '../../src/ecs';

describe('ECS', () => {
  it('should initialize', () => {
    let ecs = new ECS();

    expect(ecs.entities).to.be.an('array');
    expect(ecs.systems).to.be.an('array');
  });

  describe('addSystem()', () => {
    let ecs, entity, system;

    beforeEach(() => {
      ecs = new ECS();
      entity = new ECS.Entity();
      system = new ECS.System();
    });

    it('should call enter() when update', () => {
      system.test = () => true;
      system.enter = sinon.spy();
      ecs.addSystem(system);
      ecs.addEntity(entity);

      ecs.update();

      expect(system.enter.calledWith(entity)).to.be.equal(true);
    });

    it('should call enter() when removing and re-adding a system', () => {
      system.test = () => true;
      system.enter = sinon.spy();
      ecs.addSystem(system);
      ecs.addEntity(entity);
      ecs.update();

      ecs.removeSystem(system);
      ecs.update();

      ecs.addSystem(system);
      ecs.update();

      expect(system.enter.calledTwice).to.be.equal(true);
    });
  });

  describe('removeSystem()', () => {
    let ecs, entity, system;

    beforeEach(() => {
      ecs = new ECS();
      entity = new ECS.Entity();
      system = new ECS.System();
    });

    it('should call exit(entity) when removed', () => {
      system.test = () => true;
      system.exit = sinon.spy();

      ecs.addSystem(system);
      ecs.addEntity(entity);

      ecs.update();

      ecs.removeSystem(system);

      expect(system.exit.calledWith(entity)).to.be.equal(true);
    });
  });
});
