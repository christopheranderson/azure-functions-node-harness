const functionLoader = require('./function-loader'),
    inputBinder = require('./input-binder');


var FunctionHarness = function (nameOrPath, config = {}) {
    that = this;
    this.config = config;

    this.moduleConfig = this.config.moduleConfig || functionLoader.loadFunction(nameOrPath, this.config.dirname);

    this.invokeHttpTrigger = function (httpTriggerData, otherBindings = {}, cb = _ => { }) {
        let data = {};

        if (!httpTriggerData) {
            data = { httpTrigger: { reqBody: that.moduleConfig.sampleData } };
        } else {
            data = Object.assign({}, { httpTrigger: httpTriggerData }, otherBindings);
        }

        return this.invoke(data);
    }

    this.invoke = function (data, cb = _ => { }) {
        invoke = this;
        var inputs = inputBinder(data);

        return new Promise(function (resolve, reject) {
            invoke.context = {
                bindings: data,
                done: function (err, results) {
                    if (err) {
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
                }
            }

            setupLogging(invoke.context);
            inputs.unshift(invoke.context);

            that.moduleConfig.function.apply(null, inputs);
        });

    }
    return {
        invoke: that.invoke,
        invokeHttpTrigger: that.invokeHttpTrigger
    }
}

function setupLogging(context) {
    let log = console.log;
    [ 'info', 'error', 'warn', 'verbose'].forEach((logLevel) => {
        log[logLevel] = console.log;
    });
    context.log = log;
}

module.exports = FunctionHarness