const test = require("tape");
const func = require('../../src/index.js');
const requestBuilder = require('../../src/request-builder')

test('Http trigger', function(group){
    group.test('request is passed to function as parameter', function (t){
        t.plan(1);

        const expected = {
            method: "POST",
            body: {prop1: "value1"}
        }

        var functionToTest = function(context, req) {
            const actual = req;
            t.same(actual, expected);
        }

        const httpFunction = func('http-func', {moduleConfig: {function: functionToTest}}); 
        httpFunction.invoke({req: expected});
    });

    group.test('if http binding full request object built', function (t){
        t.plan(1);

        const requestBody = {
            test: "test"
        }

        const expected =  {
            headers: {},
            originalUrl: "http://node-test-harness",
            params: {},
            query: {},
            method: "POST",
            body: requestBody,
            rawBody: JSON.stringify(requestBody),
        }

        var functionToTest = function(context, req) {
            const actual = req;
            t.same(actual, expected);
        }

        const httpFunction = func('http-func', {moduleConfig: {function: functionToTest}}); 
        httpFunction.invoke({requestBody: requestBody});
    });
    
    group.end();
});