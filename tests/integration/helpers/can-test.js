import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { Ability } from 'ember-can';
import { computed } from '@ember/object';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';

module('Integration | Helper | can', function(hooks) {
  setupRenderingTest(hooks);

  test('it works without model', async function(assert) {
    assert.expect(1);

    this.owner.register('ability:post', Ability.extend({
      canWrite: true
    }));

    await render(hbs`{{if (can "write post") "true" "false"}}`);
    assert.dom(this.element).hasText('true');
  });

  test('it can receives model', async function(assert) {
    assert.expect(2);

    this.owner.register('ability:post', Ability.extend({
      canWrite: computed('model.write', function() {
        return this.get('model.write');
      }),
    }));

    this.set('model', { write: false });
    await render(hbs`{{if (can "write post" model) "true" "false"}}`);
    assert.dom(this.element).hasText('false');

    this.set('model', { write: true });
    assert.dom(this.element).hasText('true');
  });

  test('it can receives properties', async function(assert) {
    assert.expect(2);

    this.owner.register('ability:post', Ability.extend({
      canWrite: computed('write', function() {
        return this.get('write');
      }),
    }));

    this.set('write', false);
    await render(hbs`{{if (can "write post" write=write) "true" "false"}}`);
    assert.dom(this.element).hasText('false');

    this.set('write', true);
    assert.dom(this.element).hasText('true');
  });

  test('it can receives model and properties', async function(assert) {
    assert.expect(2);

    this.owner.register('ability:post', Ability.extend({
      canWrite: computed('model.write', 'write', function() {
        return this.get('model.write') && this.get('write');
      }),
    }));

    this.set('write', false);
    this.set('model', { write: false });
    await render(hbs`{{if (can "write post" model write=write) "true" "false"}}`);
    assert.dom(this.element).hasText('false');

    this.set('write', true);
    this.set('model', { write: true });
    assert.dom(this.element).hasText('true');
  });

  test('it reacts on ability change', async function(assert) {
    assert.expect(2);

    this.owner.register('service:session', Service.extend({
      isLoggedIn: false
    }));

    this.owner.register('ability:post', Ability.extend({
      session: service(),

      canWrite: computed('session.isLoggedIn', function() {
        return this.get('session.isLoggedIn');
      })
    }));

    await render(hbs`{{if (can "write post") "true" "false"}}`);
    assert.dom(this.element).hasText('false');

    run(() => this.owner.lookup('service:session').set('isLoggedIn', true));
    assert.dom(this.element).hasText('true');
  });
});
