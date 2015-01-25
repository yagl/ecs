import MyLibrary from '../../src/MyLibrary';

describe('MyLibrary', function() {
  it('something', function() {
    expect(MyLibrary.mainFn()).to.equals('hello');
  });
});
