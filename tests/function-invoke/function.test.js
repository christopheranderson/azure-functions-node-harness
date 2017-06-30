var test = require("tape");
var func = require('../../src/index.js');

test('function invoke', function(group){   
    group.test('should return if exists', function (t){
        t.plan(1);

        var simpleFunc = func('simple-test-func', {dirname: 'tests/function-invoke'}); 

        simpleFunc.invoke({}, function(context){
            t.pass("function was invoked successfully")
        });
    });

    group.test('should return if export is object with one property ', function (t){
        t.plan(1);

        var simpleFunc =  func('single-export-func',  {dirname: 'tests/function-invoke'});

        simpleFunc.invoke({}, function(context){
            t.pass("function was invoked successfully")
        });
    });

     group.test('should return if export has run property', function (t){
        t.plan(1);

        var simpleFunc =  func('run-property-func',  {dirname: 'tests/function-invoke'});

        simpleFunc.invoke({}, function(context){
            t.pass("function was invoked successfully")
        });
    });

    group.test('should return if function.json has entryPoint Configured', function (t){
        t.plan(1);

        var simpleFunc =  func('entrypoint-func',  {dirname: 'tests/function-invoke'});

        simpleFunc.invoke({}, function(context){
            t.pass("function was invoked successfully")
        });
    });

     group.test('should throw if folder does not exist', function (t){
        t.throws(_ => {
            func('non-existing-func');
        }, new RegExp('Could not find a function:.*not a valid directory.'));
        
        t.end();
    });

      group.test('should throw if no function.json', function (t){
        t.throws(_ => {
            func('no-functionjson-func',  {dirname: 'tests/function-invoke'});
        },new RegExp('Could not find a function.*no function.json file.'));

        t.end();
    });


    group.test('should throw if function.json has invalid entryPoint', function (t){
        t.throws(_ => {
            func('entrypoint-invalid-func',  {dirname: 'tests/function-invoke'});
        },new RegExp('Could not find a function.*failed on the Azure Functions resolution rules.'));

        t.end();
    });

    group.test('should throw if module does not export function', function (t){
        t.throws(_ => {
            func('multiple-function-export-func',  {dirname: 'tests/function-invoke'});
        },new RegExp('Could not find a function.*failed on the Azure Functions resolution rules.'));

        t.end();
    });

});
