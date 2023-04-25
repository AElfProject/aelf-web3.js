/* eslint-disable import/no-extraneous-dependencies */
const glob = require('glob');
const { exec } = require('child_process');
/* eslint-enable */

glob.sync('proto/*.proto').forEach(name => {
  console.log(`npx pbjs -t json ${name} > ${name}.json`);
  exec(`npx pbjs -t json ${name} > ${name}.json`, err => {
    if (err) {
      return;
    }
    console.log(`${name}: compile done`);
  });
});
