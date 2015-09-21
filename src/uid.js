/**
 * UIDGenerator for multi-instance Entity Component System
 * Generate numeric unique ids for ECS entities. The requirements are:
 *  * generate Numbers for fast comparaison, low storage and bandwidth usage
 *  * generators can be salted so you can use multiple generators with 
 *  uniqueness guaranty
 *  * each salted generator can generate reasonable amount of unique ids
 */

// maximum number of salted generators that can run concurently, once the
// number of allowed generators has been reached the salt of the next 
// generator is silently reset to 0
const MAX_SALTS = 10000;

const MAX_ENTITY_PER_GENERATOR = Math.floor(Number.MAX_SAFE_INTEGER / 
  MAX_SALTS) - 1;
let currentSalt = 0;

class UIDGenerator {
  constructor(salt = 0) {
    this.salt = salt;
    this.uidCounter = 0;
  }
  next() {
    let nextUid = this.salt + this.uidCounter * MAX_SALTS;

    if (++this.uidCounter >= MAX_ENTITY_PER_GENERATOR) {
      this.uidCounter = 0;
    }

    return nextUid;
  }
}

const GeneratorManager = {
  UIDGenerator,
  DefaultUIDGenerator: new UIDGenerator(currentSalt++),
  nextGenerator: () => new UIDGenerator(currentSalt++),
  nextGeneratorSalt: () => currentSalt++
};

export default GeneratorManager;