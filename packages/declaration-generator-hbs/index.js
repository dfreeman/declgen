'use strict';

const stew = require('broccoli-stew');
const { stripIndent } = require('common-tags');

module.exports = {
  name: require('./package').name,

  setupDeclarationGeneratorRegistry(type, registry) {
    if (type === 'parent') {
      registry.addGenerator({
        name: 'template-types',
        extensions: ['hbs'],
        toTree(type, tree) {
          tree = stew.find(tree, '**/*.hbs');
          tree = stew.rename(tree, '.hbs', '.d.ts');
          tree = stew.map(tree, () => {
            return stripIndent`
              // This is an autogenerated file. Do not edit it directly.
              import { TemplateFactory } from 'htmlbars-inline-precompile';

              declare const template: TemplateFactory;
              export default template;
            `;
          });
          return tree;
        }
      });
    }
  }
}
