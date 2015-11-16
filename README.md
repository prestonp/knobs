Knobs
---

> Easy feature toggles

Install
---

```
npm install knobs
```

Usage
---

Define a list of features, each feature supports

* name (required) - string for the feature name
* env - a boolean environment variable for configuring the features. Takes
  precedence over the `default` value.
* default - a boolean or function

```js
var features = [
  { "name": "autorecovery", "env": "FEATURE_AUTORECOVERY", "default": false },
  { "name": "dynamic_scaling", "env": "FEATURE_DYNAMIC_SCALING", "default": false },
  { "name": "holiday_promo", "default": function(user) { return user.id % 2; } }
];
var Knobs = require('Knobs').default;
var knobs = new Knobs(features);

process.env['FEATURE_DYNAMIC_SCALING'] = true;
knobs.enabled('autorecovery'); // false
knobs.enabled('dynamic_scaling'); // true
knobs.enabled('holiday_promo', { id: 5 }); // true
knobs.enabled('holiday_promo', { id: 4 }); // false
```

Using Knobs allows for easy A/B testing. You could schedule
future releases or slowly roll out by using a computed value:

```js
knobs.load([
  {
    'name': 'foo',
    'default': function() {
      return Math.floor(Math.random()*10) % 2;
    }
  },
  {
    'name': 'bar',
    'default': function() {
      return new Date() > '02-12-2016';
    }
  }
]);

knobs.enabled(foo); // enabled for approx half of users
knobs.enabled(bar); // enabled after a certain date
```

Or you can manually override things with environment variables:

script.js

```js
knobs.load({ name: 'foo', env: 'FEATURE_FOO', default: false });
console.log('Foo Enabled -', knobs.enabled('foo'));
```

Running without specified flags
```bash
$ node script
Foo Enabled - false
```
Running with flag on
```bash
$ FEATURE_FOO=true node script
Foo Enabled - true
```


API
---

constructor(features)
---

Create a new Knobs instance with a list of features.

.load
---

Load in a list of features.

.set(name, val)
---

Set the value of a feature. `val` can be a boolean or a function.

.enable(name)
---

Alias for `.set(name, true)`

.disable(name)
---

Alias for `.set(name, false)`

.enabled(name, [...args])
---

Returns whether a feature is enabled. Accepts optional parameters
if the feature is defined by a computed value function.

.disabled(name, [...args])
---

Inverse of `.enabled`

Events
---

Knobs is an event emitter and emits on certain methods.

'load' event
---

When features are loaded, the "load" event is emitted with
the list of features.

```js
knobs.load(require('./features.json'));
knobs.on('load', (features) => { ... });
```

'change:[name]' event
---

Emitted when a feature changes via `.set`, `.enable` or `.disable`
with the new feature value.

```js
knobs.enable('launch redesign');
knobs.on('change:launch redesign', (val) => { ... });
```

License
---

MIT
