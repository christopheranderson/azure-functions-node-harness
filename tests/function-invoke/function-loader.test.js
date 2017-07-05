var test = require("tape");
var funcLoader = require('../../src/function-loader');

test('function loader tests', function(group){   
    group.test('should load function.json and extract function', function (t){
        const actual = funcLoader.loadFunction('simple-test-func', 'tests/function-invoke'); 
        const expected = {
            config: {},
            function: require('./simple-test-func/index')
        };

        t.same(actual, expected);
        t.end();
    });

    group.test('should load function.json and single exported function', function (t){
        const actual =  funcLoader.loadFunction('single-export-func',  'tests/function-invoke');
        const expected = {
            config: {
                "disabled": false
            },
            function: require('./single-export-func/').mainFunction
        };
        
        t.same(actual, expected);
        t.end()
    });

     group.test('should load function.json and run function', function (t){
        const actual =  funcLoader.loadFunction('run-property-func',  'tests/function-invoke');
        const expected = {
            config: {
                "disabled": false
            },
            function: require('./run-property-func').run
        }

        t.same(actual, expected);
        t.end();
    });

    group.test('should return if function.json has entryPoint Configured', function (t){
        const actual =  funcLoader.loadFunction('entrypoint-func',  'tests/function-invoke');
        const expected ={
            config: {
                "entryPoint": "mainFunction",
                "disabled": false
            },
            function: require('./entrypoint-func').mainFunction
        };
        
        t.same(actual, expected);
        t.end();
    });

    group.test('should throw if folder does not exist', function (t){
        t.throws(_ => {
            funcLoader.loadFunction('non-existing-func');
        }, new RegExp('Could not find a function:.*not a valid directory.'));
        
        t.end();
    });

    group.test('should throw if no function.json', function (t){
        t.throws(_ => {
            funcLoader.loadFunction('no-functionjson-func',  'tests/function-invoke');
        },new RegExp('Could not find a function.*no function.json file.'));

        t.end();
    });

    group.test('should throw if function.json has invalid entryPoint', function (t){
        t.throws(_ => {
            funcLoader.loadFunction('entrypoint-invalid-func',  'tests/function-invoke');
        },new RegExp('Could not find a function.*failed on the Azure Functions resolution rules.'));

        t.end();
    });

    group.test('should throw if module does not export function', function (t){
        t.throws(_ => {
            funcLoader.loadFunction('multiple-function-export-func',  'tests/function-invoke');
        },new RegExp('Could not find a function.*failed on the Azure Functions resolution rules.'));

        t.end();
    });

});
