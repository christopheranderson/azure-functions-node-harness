var util = require('util'),
    path = require('path'),
    fs = require('fs');

var FunctionHarness = function(nameOrPath, config = {}) {
    that = this;
    this.config = config;

    this.f = loadFunction(nameOrPath, this.config.dirname);
    
    this.invoke = function(data, cb = _ => {}) {
        invoke = this;
        var inputs = (function(data) {
            var out = [];
            for(var name in data) {
                out.push(data[name]);
            }
            return out;
        })(data);
       
        return new Promise(function(resolve, reject) {
            invoke.context = {
                bindings: data,
                done: function(err, results) {
                    if(err) {
                        reject(err);
                        return cb(err);
                    } else {
                        var output = [];
                
                        for (var name in results) {
                            invoke.bindings[name] = results[name];
                        }

                        resolve(invoke.context);
                        return cb(invoke.context);
                    }
                },
                log: function(log) {
                    console.log(log);
                }
            }

            inputs.unshift(invoke.context);

            that.f.function.apply(null, inputs);
        });
        
    }
    return {
        invoke: that.invoke
    }
}

var loadFunction = function(nameOrPath, dirname) {   
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

module.exports = FunctionHarness