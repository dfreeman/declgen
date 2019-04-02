'use strict';

const stew = require('broccoli-stew');

module.exports = {
  name: require('./package').name,

  setupDeclarationGeneratorRegistry(type, registry) {
    if (type === 'parent') {
      const cssModules = this.parent.addons.find(addon => addon.name === 'ember-css-modules');
      const extension = cssModules.getFileExtension();

      registry.addGenerator({
        name: 'css-modules',
        extensions: [extension],
        toTree(type, tree) {
          const preprocessor = cssModules.modulesPreprocessor;
          const modulesTree = preprocessor.getModulesTree();

          tree = stew.find(tree, `**/*.${extension}`);
          tree = stew.map(tree, (contents, filePath) => {
            return modulesTree
              .loadPath(preprocessor.resolvePath(filePath, `${modulesTree.inputPaths[0]}/${filePath}`))
              .then(({ exportTokens }) => {
                let lines = [
                  '// This is an autogenerated file. Do not edit it directly.',
                  'declare const styles: {'
                ];

                for (let key of Object.keys(exportTokens)) {
                  lines.push(`  '${key}': string;`);
                }

                lines.push('};', '', 'export default styles;', '');

                return lines.join('\n');
              });
          });
          tree = stew.rename(tree, `.${extension}`, '.d.ts');
          return tree;
        }
      });
    }
  }
}