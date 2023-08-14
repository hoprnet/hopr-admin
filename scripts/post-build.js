var fs = require('fs');

configPath = `${__dirname.replace('scripts', 'config.ts')}`;

fs.unlink(configPath, function (err) {
    if (err) { throw err }
    else {
        fs.rename(`${configPath}_`, configPath, function (err) {
            if (err) throw err
            console.log('Original config brought back.')
        });
    }
});