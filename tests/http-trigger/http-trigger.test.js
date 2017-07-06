const test = require("tape");
const func = require('../../src/index.js');
const requestBuilder = require('../../src/request-builder');
const functionLoader = require('../../src/function-loader');

test('Http trigger', function (group) {
    group.test('request is passed to function as parameter', function (t) {
        t.plan(1);

        const expected = {
            method: "POST",
            body: { prop1: "value1" }
        }

        var functionToTest = function (context, req) {
            const actual = req;
            t.same(actual, expected);
        }

        const httpFunction = func('http-func', { moduleConfig: { function: functionToTest } });
        httpFunction.invoke({ req: expected });
    });

    group.test('if http binding full request object built', function (t) {
        t.plan(1);

        const requestBody = {
            test: "test"
        }

        const expected = getExpectedState(requestBody);

        var functionToTest = function (context, req) {
            const actual = req;
            t.same(actual, expected);
        }

        const httpFunction = func('http-func', { moduleConfig: { function: functionToTest } });
        httpFunction.invoke({ httpTrigger: { reqBody: requestBody } });
    });

    group.test('use simplified http trigger api', function (t) {
        t.plan(1);

        var headers = {
            accept: 'application/json, */*',
            'content-type': 'application/json'
        };

        const requestBody = {
            test: "test"
        };

        const expected = getExpectedState(requestBody, headers);

        var functionToTest = function (context, req) {
            const actual = req;
            t.same(actual, expected);
        };

        const httpFunction = func('http-func', { moduleConfig: { function: functionToTest } });
        httpFunction.invokeHttpTrigger({ reqBody: requestBody, headers: headers });
    });

    group.test('use simplified http trigger api still pass other bindings', function (t) {
        t.plan(2);

        const requestBody = {
            test: "test"
        }
        const expected = getExpectedState(requestBody);

        var functionToTest = function (context, req, otherBinding) {
            const actual = req;
            t.same(actual, expected);
            t.same(otherBinding, "other data")
        }

        const httpFunction = func('http-func', { moduleConfig: { function: functionToTest } });
        httpFunction.invokeHttpTrigger({ reqBody: requestBody }, { otherBinding: "other data" });
    });

    group.test('if pass no data it will use sample.json', function (t) {
        t.plan(1);
        
        // use function loader so can override function for testing.
        let moduleConfig = functionLoader.loadFunction("sampledata-func", "tests/test-functions")

        const expected = getExpectedState({
            "sampleData": "001",
            "somethingelse": "000"
        });

        //override for testing
        moduleConfig.function = function (context, req, otherBinding) {
            const actual = req;
            t.same(actual, expected);
        }

        const httpFunction = func('sampledata-func', { moduleConfig: moduleConfig });
        httpFunction.invokeHttpTrigger();
    });

    group.end();
});

const getExpectedState = function (body, headers = {}) {
    return {
        headers: headers,
        originalUrl: "http://node-test-harness",
        params: {},
        query: {},
        method: "POST",
        body: body,
        rawBody: JSON.stringify(body),
    }
}
