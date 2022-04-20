const scss = require('rollup-plugin-scss');

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      scss({
        output: 'dist/styles.css',
        inject: false,
        // only write out CSS for the first bundle (avoids pointless extra files):
        extract: !!options.writeMeta,
      })
    );
    return config;
  },
};
