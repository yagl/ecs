import ECS from '../../src/ecs';

describe('ECS', () => {
  it('should initialize', () => {
    let ecs = new ECS();

    expect(ecs.entities).to.be.an('array');
    expect(ecs.systems).to.be.an('array');
  });
});
