import ECS from '../../src/ecs';

describe('ECS', () => {
  it('should initialize', () => {
    let ecs = new ECS();

    expect(ecs.entities).to.be.an('array');
    expect(ecs.systems).to.be.an('array');
  });

  it('should execute the system and call enter()', () => {
    let ecs = new ECS();
    let entity = new ECS.Entity();
    let system = new ECS.System();

    system.test = () => true;
    system.enter = sinon.spy();
    ecs.addSystem(system);
    ecs.addEntity(entity);

    ecs.update();

    expect(system.enter.calledWith(entity)).to.be.equal(true);
  });
});
