import { test, module } from 'qunit';
import { normalize, isPromise } from 'ember-can/utils/helpers';
import RSVP from 'rsvp';

module('Unit | Utils | helpers', function() {
  module('#normalize', function() {
    test('normalizes basic combined string', function(assert) {
      assert.expect(2);

      let norm = normalize('edit post');

      assert.equal('canEdit', norm.propertyName);
      assert.equal('post', norm.abilityName);
    });

    test('removes stopwords from combined string', function(assert) {
      assert.expect(12);
      let norm;

      norm = normalize('manage members in project');
      assert.equal('canManageMembers', norm.propertyName);
      assert.equal('project', norm.abilityName);

      norm = normalize('add tags to post');
      assert.equal('canAddTags', norm.propertyName);
      assert.equal('post', norm.abilityName);

      norm = normalize('remove tags from post');
      assert.equal('canRemoveTags', norm.propertyName);
      assert.equal('post', norm.abilityName);

      norm = normalize('change colour of door');
      assert.equal('canChangeColour', norm.propertyName);
      assert.equal('door', norm.abilityName);

      norm = normalize('set timezone for account');
      assert.equal('canSetTimezone', norm.propertyName);
      assert.equal('account', norm.abilityName);

      norm = normalize('comment on issues');
      assert.equal('canComment', norm.propertyName);
      assert.equal('issues', norm.abilityName);
    });
  });

  module('#isPromise', function () {
    test('when obj is promise', assert => {
      assert.expect(2);

      const resolve = isPromise(RSVP.resolve());
      const reject = isPromise(RSVP.reject());

      assert.ok(resolve, '`resolve` is a promise');
      assert.ok(reject, '`reject` is a promise');
    });

    test('when obj is not promise', assert => {
      assert.expect(1);

      const result = isPromise({});

      assert.notOk(result, 'passed argument is not a promise');
    });
  })
});
