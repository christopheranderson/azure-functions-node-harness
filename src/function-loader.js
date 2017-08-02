const path = require('path'),
    fs = require('fs');

module.exports = {
    loadFunction: function (nameOrPath, dirname) {
        var directory = dirname || findHostDir();

        var pathToModule = path.resolve(path.join(directory, nameOrPath));

        if (!fs.existsSync(pathToModule)) {
            throw `Could not find a function: '${pathToModule}' not a valid directory.`;
        }

        try {
            pathToModule = require.resolve(pathToModule)
        } catch (err) {
            throw `Could not find a function: '${pathToModule}' not a valid module.`;
        }

        var config = {};
        try {
            config = require(path.join(path.dirname(pathToModule), 'function.json'));
        } catch (err) {
            throw `Could not find a function: '${pathToModule}' no function.json file.`;
        }

        const sampleDataPath = path.join(path.dirname(pathToModule), 'sample.dat');
        let sampleData = {};
        if (fs.existsSync(sampleDataPath)) {
            try {
                sampleData = JSON.parse(fs.readFileSync(sampleDataPath, 'utf8'));
            } catch (ex) {
                console.log("was unable to load sample data. skipping.");
                // noop 
            }
        }

        var m = require(pathToModule);

        if (typeof m === 'function') {
            return {
                function: m,
                config: config,
                sampleData: sampleData
            };
        } else if (config.entryPoint && m[config.entryPoint]) {
            return {
                function: m[config.entryPoint],
                config: config,
                sampleData: sampleData
            };
        } else if (Object.keys(m).length === 1) {
            return {
                function: m[Object.keys(m)[0]],
                config: config,
                sampleData: sampleData
            };
        } else if (typeof m['run'] === 'function') {
            return {
                function: m['run'],
                config: config,
                sampleData: sampleData
            };
        } else {
            throw 'Could not find a function: failed on the Azure Functions resolution rules.';
        }
    }
}

function findHostDir() {   
    const cwd = process.cwd();
    const hostFileDir = findDirWithHostFile(cwd); 
    
    // if can't find then return cwd and hope for the best :-)
    return  hostFileDir || cwd;    
}

// there is probably an api that helps search faster?
function findDirWithHostFile(dir) {
    var hostDirectory;
    fs.readdirSync(dir).forEach(shortname => {
        if (shortname === "host.json") {
            hostDirectory = dir;
            return;
        }
        
        const subdir = dir + '/' + shortname;
        var stat = fs.statSync(subdir);

        if (stat && stat.isDirectory() && 
            shortname !=='node_modules' && 
            shortname !=='.git') {
            
            const result = findDirWithHostFile(subdir)
            if (result){
                hostDirectory =result;
                return;
            }
        } 
    });

    return hostDirectory;
}