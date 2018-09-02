import { assert, should } from 'chai';
import Model from '../../src/model';

const { log } = console;


let model = new Model();

test('Basic instance usage', () => {
  model = new Model();
  assert.equal(model.toString(), '{}');
});

test('Instance with default attribute', () => {
  model = new Model({
    id: 10,
    name: 'Nice',
    fullName() {
      return `${this.name} Kante`;
    },
  });
  assert.equal(model.id, 10);
  assert.equal(model.name, 'Nice');
  assert.equal(model.age, undefined);
  assert.equal(model.fullName(), 'Nice Kante');
});

test('Check getter/setters', () => {
  model = new Model({
    age: 10,
    lastName: 'Kante',
    friends: [
      {
        name: 'wassy',
      },
      {
        name: 'Luck',
      },
    ],
  });
  // Testing getter
  assert.equal(model.age, 10);
  assert.equal(model.get('lastName'), 'Kante');
  assert.equal(model.lastName, model.get('lastName'));
  assert.equal(model.get('first_name'), null);
  assert.equal(model.first_name, undefined);
  assert.equal(model.get('first_name', 'moh'), 'moh');
  assert.equal(model.get('friends[0].name'), 'wassy');
  assert.equal(model.get('friends[1].name'), 'Luck');
  assert.equal(model.get('friends[1].age'), null);
  // Testing setter
  model.set('friends[1].age', 40);
  assert.equal(model.get('friends[1].age'), 40);
});

test('Check getter/setters', () => {
  const m1 = new Model({ name: 'm1' });
  const m2 = new Model({ name: 'm2' });
  should(m1.name).not.equal(m2.name);
  m2.name = '_m2';
  should(m2.name).not.equal('_m2');
  should(m1.name).not.equal(m2.name);
});

test('Getter/setter function not overridable', () => {
  model = new Model({
    name: 'Hello',
    get() {
      return this.name;
    },
    set(val) {
      this.name = val;
    },
    toString: 10,
  });
  log(model.toString());
  should(model.toString).not.equal(10);
  assert.equal(model.toString(), '{"name":"Hello"}');
  assert.equal(model.get(), null);
  model.set('more');
  assert.equal(model.name, 'Hello');
});
