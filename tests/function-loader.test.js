var test = require("tape");
var funcLoader = require('../src/function-loader');

test('#### function loader tests ####', function (group) {
    group.test('should load function.json and extract function', function (t) {
        const actual = funcLoader.loadFunction('simple-test-func', 'tests/test-functions');
        const expected = {
            config: {},
            function: require('./test-functions/simple-test-func/index'),
            sampleData:{}
        };

        t.same(actual, expected);
        t.end();
    });

    group.test('should load function.json and single exported function', function (t) {
        const actual = funcLoader.loadFunction('single-export-func', 'tests/test-functions');
        const expected = {
            config: {
                "disabled": false
            },
            function: require('./test-functions/single-export-func').mainFunction,
            sampleData:{}
        };

        t.same(actual, expected);
        t.end()
    });

    group.test('should load function.json and run function', function (t) {
        const actual = funcLoader.loadFunction('run-property-func', 'tests/test-functions');
        const expected = {
            config: {
                "disabled": false
            },
            function: require('./test-functions/run-property-func').run,
            sampleData:{}
        }

        t.same(actual, expected);
        t.end();
    });

    group.test('should return if function.json has entryPoint Configured', function (t) {
        const actual = funcLoader.loadFunction('entrypoint-func', 'tests/test-functions');
        const expected = {
            config: {
                "entryPoint": "mainFunction",
                "disabled": false
            },
            function: require('./test-functions/entrypoint-func').mainFunction,
            sampleData:{}
        };

        t.same(actual, expected);
        t.end();
    });

    group.test('should load sample.dat if there', function (t) {
        const actual = funcLoader.loadFunction('sampledata-func', 'tests/test-functions');
        const expected = {
            config: {},
            function: require('./test-functions/sampledata-func'),
            sampleData: {
                "sampleData": "001",
                "somethingelse": "000"
            }
        };

        t.same(actual, expected);
        t.end();
    });

    group.test('should throw if folder does not exist', function (t) {
        t.throws(_ => {
            funcLoader.loadFunction('non-existing-func');
        }, new RegExp('Could not find a function:.*not a valid directory.'));

        t.end();
    });

    group.test('should throw if no function.json', function (t) {
        t.throws(_ => {
            funcLoader.loadFunction('no-functionjson-func', 'tests/test-functions');
        }, new RegExp('Could not find a function.*no function.json file.'));

        t.end();
    });

    group.test('should throw if function.json has invalid entryPoint', function (t) {
        t.throws(_ => {
            funcLoader.loadFunction('entrypoint-invalid-func', 'tests/test-functions');
        }, new RegExp('Could not find a function.*failed on the Azure Functions resolution rules.'));

        t.end();
    });

    group.test('should throw if module does not export function', function (t) {
        t.throws(_ => {
            funcLoader.loadFunction('multiple-function-export-func', 'tests/test-functions');
        }, new RegExp('Could not find a function.*failed on the Azure Functions resolution rules.'));

        t.end();
    });

});
