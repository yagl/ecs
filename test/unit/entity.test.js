import Entity from '../../src/entity';

class FakeComponent {
  constructor() {
    this.attr = null;
  }
}

FakeComponent.mixins = [{
  name: 'test',
  method: function () {

  }
}];

describe('Entity', () => {
  it('should initialize', () => {
    let entity = new Entity();

    expect(entity.id).to.be.a('number');
  });

  it('should have an unique id', () => {
    let entity1 = new Entity();
    let entity2 = new Entity();

    expect(entity1.id).to.be.not.equal(entity2.id);
  });

  describe('addComponent()', () => {

  });
});
