var test = require("tape");
var func = require('../src/index.js');

test('#### function integration tests ####', function(group){   
    group.test('should return if exists', function (t){
        t.plan(1);

        var simpleFunc = func('simple-test-func', {dirname: 'tests/test-functions'}); 

        simpleFunc.invoke({}, function(context){
            t.pass("function was invoked successfully")
        });
    });

    group.test('should return if export is object with one property ', function (t){
        t.plan(1);

        var simpleFunc =  func('single-export-func',  {dirname: 'tests/test-functions'});

        simpleFunc.invoke({}, function(context){
            t.pass("function was invoked successfully")
        });
    });

     group.test('should return if export has run property', function (t){
        t.plan(1);

        var simpleFunc =  func('run-property-func',  {dirname: 'tests/test-functions'});

        simpleFunc.invoke({}, function(context){
            t.pass("function was invoked successfully")
        });
    });

    group.test('should return if function.json has entryPoint Configured', function (t){
        t.plan(1);

        var simpleFunc =  func('entrypoint-func',  {dirname: 'tests/test-functions'});

        simpleFunc.invoke({}, function(context){
            t.pass("function was invoked successfully")
        });
    });

    group.test('if advanced logging is used should not fail test', function (t){
        t.plan(1);

        var loggingFunc =  func('logging-test',  {dirname: 'tests/test-functions'});

        loggingFunc.invoke({}).then( context => {
            t.pass("function was invoked successfully")
        })
        .catch(err => {
            t.fail(`should not reach here: ${err}`);
        });
    });

});
