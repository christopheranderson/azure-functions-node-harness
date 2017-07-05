const functionLoader = require('./function-loader');

var FunctionHarness = function(nameOrPath, config = {}) {
    that = this;
    this.config = config;

    this.moduleConfig = this.config.moduleConfig || functionLoader.loadFunction(nameOrPath, this.config.dirname);
    
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

            that.moduleConfig.function.apply(null, inputs);
        });
        
    }
    return {
        invoke: that.invoke
    }
}

module.exports = FunctionHarness