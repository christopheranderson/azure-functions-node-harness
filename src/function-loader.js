const path = require('path'),
    fs = require('fs');

module.exports = {
    loadFunction: function(nameOrPath, dirname) {   
        var directory = dirname || process.cwd();

        var pathToModule = path.resolve(path.join(directory, nameOrPath));

        if (!fs.existsSync(pathToModule)) {
            throw `Could not find a function: '${pathToModule}' not a valid directory.`;
        }

        try{
            pathToModule = require.resolve(pathToModule)
        }catch(err){
            throw `Could not find a function: '${pathToModule}' not a valid module.`;
        }

        var config = {};
        try{
            config = require(path.join(path.dirname(pathToModule), 'function.json'));
        }catch(err){
            throw `Could not find a function: '${pathToModule}' no function.json file.`;
        }
    
        var m = require(pathToModule);

        if(typeof m === 'function') {
            return { 
                function: m,
                config: config
            };
        } else if (config.entryPoint && m[config.entryPoint]) {
            return {
                function: m[config.entryPoint],
                config: config
            };
        } else if (Object.keys(m).length === 1) {
            return {
                function: m[Object.keys(m)[0]],
                config: config
            };
        } else if (typeof m['run'] === 'function') {
            return {
                function: m['run'],
                config: config
            };
        } else {
            throw 'Could not find a function: failed on the Azure Functions resolution rules.';
        }
    }
}