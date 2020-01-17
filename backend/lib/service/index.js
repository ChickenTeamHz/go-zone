const fs = require('fs');
const path = require('path');
var modelsPath = path.resolve(__dirname, './');
fs.readdirSync(modelsPath).forEach(function (name) {
    if (path.extname(name) !== '') {
        name = path.basename(name, '.js');
        if (name != 'index') {      
          let currentName = name.substr(0, 1).toUpperCase() + name.slice(1) + 'Service';
          exports[currentName] = require(path.resolve(modelsPath, name));
        }
    }
});