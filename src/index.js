import { EventEmitter } from 'events';

export default class Knobs extends EventEmitter {
  constructor(features) {
    super();
    this.load(features);
  }

  load(features) {
    if (typeof features !== 'object') {
      throw new Error('list of features required');
    }

    this.features = features.reduce((toggles, feature) => {
      if (!feature.name) {
        throw new Error('feature requires a name');
      }

      toggles[feature.name] = process.env[feature.env] || feature.default || false;
      return toggles;
    }, {});

    this.emit('load', this.features);
    return this.features;
  }

  set(name, val) {
    this.emit(`change:${name}`, val);
    this.features[name] = val;
    return this.features[name];
  }

  list() {
    return this.features;
  }

  enabled(name, ...args) {
    if (typeof this.features[name] === 'function') {
      return this.features[name](...args);
    }
    return this.features[name];
  }

  disabled(name, ...args) {
    return !this.enabled(name, ...args);
  }

  enable(name) {
    return this.set(name, true);
  }

  disable(name) {
    return this.set(name, false);
  }
}
