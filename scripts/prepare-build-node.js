var fs = require('fs');
configPath = `${__dirname.replace('scripts', 'config.ts')}`;

fs.readFile(configPath, function(err, data) {
    if(err) throw err;
    data = data.toString();
    data = data.replace(` = 'dev';`, ` = 'node';`);
    fs.writeFile(configPath, data, function(err) {
        err || console.log('Data replaced');
    });
});