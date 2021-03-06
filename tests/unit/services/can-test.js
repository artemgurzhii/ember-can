import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { Ability } from 'ember-can';
import { computed } from '@ember/object';

module('Unit | Service | can', function(hooks) {
  setupTest(hooks);

  test('parse', function(assert) {
    assert.expect(2);

    let service = this.owner.lookup('service:can');

    assert.deepEqual(service.parse('manage members in project'), {
      propertyName: 'canManageMembers',
      abilityName: 'project'
    });

    assert.deepEqual(service.parse('add tags to post'), {
      propertyName: 'canAddTags',
      abilityName: 'post'
    });
  });

  test('abilityFor', function(assert) {
    assert.expect(5);

    let service = this.owner.lookup('service:can');

    this.owner.register('ability:super-model', Ability.extend());

    let ability = service.abilityFor('superModel', { yeah: true }, { otherProp: 'it works' });

    assert.ok(ability);
    assert.ok(ability.get('model.yeah'));
    assert.equal(ability.get('otherProp'), 'it works');
    assert.ok(ability instanceof Ability);
    assert.throws(() => service.abilityFor('abilityNotFound'), 'No ability type found for abilityNotFound');
  });

  test('can', function(assert) {
    assert.expect(1);

    let service = this.owner.lookup('service:can');

    this.owner.register('ability:super-model', Ability.extend({
      canTouchThis: computed('model', function() {
        return this.get('model.yeah');
      }),
    }));

    assert.ok(service.can('touchThis in superModel', { yeah: true }));
  });

  test('cannot', function(assert) {
    assert.expect(1);

    let service = this.owner.lookup('service:can');

    this.owner.register('ability:super-model', Ability.extend({
      canTouchThis: computed('model', function() {
        return this.get('model.yeah');
      }),
    }));

    assert.notOk(service.can('touchThis in superModel', { yeah: false }));
  });
});
