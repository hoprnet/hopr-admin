const fs = require('fs');
configPath = `${__dirname.replace('scripts', 'config.ts')}`;

fs.copyFile(configPath, `${configPath}_`, (err) => {
  if (err) {
      console.log("Error Found:", err);
  } else {
      console.log("Config backed up.");

      fs.readFile(configPath, function(err, data) {
          if(err) throw err;
          data = data.toString();
          data = data.replace(`export const environment:('dev' | 'node' | 'web3') = `, `export const environment:('dev' | 'node' | 'web3') = 'web3'; //`);
          fs.writeFile(configPath, data, function(err) {
              err || console.log('Data replaced to build only Staking Hub.');
          });
      });

  }
});
  

