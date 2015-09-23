import Entity from '../../src/entity';

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
    it('should add a void object when a name is passed', () => {
      let entity = new Entity();
      entity.addComponent('test');

      expect(entity.components.test).to.deep.equal({});
    });
  });

  describe('updateComponent()', () => {
    it('should update an existing component', () => {
      let entity = new Entity();
      entity.addComponent('test', {foo: 'bar'});

      expect(entity.components.test).to.deep.equal({foo: 'bar'});

      entity.updateComponent('test', {foo: 'foo'});

      expect(entity.components.test).to.deep.equal({foo: 'foo'});
    });
  });
});
