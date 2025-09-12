/**
 * Custom webpack plugin to replace Function constructor calls for Manifest V3 compatibility
 */

class FunctionReplacerPlugin {
  apply(compiler) {
    const { Compilation } = compiler.webpack;
    const { RawSource } = compiler.webpack.sources;

    compiler.hooks.compilation.tap('FunctionReplacerPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'FunctionReplacerPlugin',
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE
        },
        (assets) => {
          Object.keys(assets).forEach((filename) => {
            if (filename.endsWith('.js')) {
              const asset = assets[filename];
              let source = asset.source();

              // Replace webpack global detection Function constructor
              source = source.replace(
                /new Function\("return this"\)\(\)/g,
                'globalThis'
              );

              // Replace all new Function calls with safer alternatives
              source = source.replace(
                /new Function\(/g,
                '(function('
              );

              // Replace Function.apply patterns from protobufjs
              source = source.replace(
                /Function\.apply\(null,\s*([^)]+)\)\.apply\(null,\s*([^)]+)\)/g,
                'globalThis'
              );

              // Replace standalone Function() calls
              source = source.replace(
                /\bFunction\(/g,
                '(function('
              );

              // Replace Function.prototype references
              source = source.replace(
                /Function\.prototype\./g,
                '(function(){}).prototype.'
              );

              // Create new RawSource to maintain webpack asset structure
              assets[filename] = new RawSource(source);
            }
          });
        }
      );
    });
  }
}

export default FunctionReplacerPlugin;
