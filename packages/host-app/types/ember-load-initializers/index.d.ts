declare module 'ember-load-initializers' {
  import Engine from '@ember/engine';

  function loadInitializers(app: typeof Engine, modulePrefix: string): void;
  export = loadInitializers;
}
