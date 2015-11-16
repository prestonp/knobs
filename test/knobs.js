var assert = require('assert');
var Knobs = require('../lib').default;
var features = [
  { "name": "autorecovery", "env": "FEATURE_AUTORECOVERY", "default": false }
];
var knobs = new Knobs(features);

describe('toggles', function() {
  it('should throw exception if missing features', function() {
    assert.throws(function() {
      knobs.load();
    }, Error);
  });

  it('should parse features list', function() {
    knobs.load(features);
    assert(!knobs.enabled('autorecovery'));
  });

  it('should parse features file with env var taking precedence', function() {
    process.env.FEATURE_AUTORECOVERY = true;
    knobs.load(features);
    assert(knobs.enabled('autorecovery'));
  });

  it('should allow minimal feature definitions', function() {
    var simpleFeatures = [ { name: 'foo' }, { name: 'bar' } ];
    knobs.load(simpleFeatures);
    assert(!knobs.enabled('foo'));
    assert(!knobs.enabled('bar'));
  });

  it('should setting feature on or off', function() {
    knobs.load(features);
    knobs.set('abc', true);
    assert(knobs.enabled('abc'));
    knobs.set('abc', false);
    assert(!knobs.enabled('abc'));
  });

  it('should enable feature', function() {
    knobs.load(features);
    knobs.enable('abc');
    assert(knobs.enabled('abc'));
  });

  it('should disable feature', function() {
    knobs.load([ { name: 'poop', default: true } ]);
    knobs.disable('poop');
    assert(!knobs.enabled('poop'));
  });

  it('should check if feature is enabled or disabled', function() {
    knobs.load(features);
    knobs.enable('abc');
    assert(knobs.enabled('abc'));
    assert(!knobs.disabled('abc'));
  });

  it('should support computed feature values', function() {
    var features = [
      { name: 'foo', default: function(a, b) { return a > b; } },
      { name: 'bar', default: function(val) { return val; } },
      { name: 'new feature', default: function(user) { return user.id % 2; }}
    ];
    knobs.load(features);
    assert(knobs.enabled('foo', 4, 3));
    assert(!knobs.enabled('bar'));
  });

  it('should emit events when features are loaded', function(done) {
    knobs.on('load', function(features) {
      assert(features);
      knobs.removeAllListeners();
      done();
    });
    knobs.load(features);
  });

  it('should emit events when features are toggled', function(done) {
    knobs.on('change:autorecovery', function(enabled) {
      assert(enabled);
      knobs.removeAllListeners();
      done();
    });
    knobs.load(features);
    knobs.enable('autorecovery');
  });
});
