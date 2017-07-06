const functionLoader = require('./function-loader'),
      inputBinder = require('./input-binder');


var FunctionHarness = function(nameOrPath, config = {}) {
    that = this;
    this.config = config;

    this.moduleConfig = this.config.moduleConfig || functionLoader.loadFunction(nameOrPath, this.config.dirname);
    
    this.invokeHttpTrigger = function(httpTriggerData, otherBindings = {}, cb = _ => {}){
        const data = Object.assign({}, {httpTrigger: httpTriggerData}, otherBindings);
        this.invoke(data);
    }

    this.invoke = function(data, cb = _ => {}) {
        invoke = this;
        var inputs = inputBinder(data);
       
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
        invoke: that.invoke,
        invokeHttpTrigger: that.invokeHttpTrigger
    }
}

module.exports = FunctionHarness