const test = require("tape");
const func = require('../../src/index.js');

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

    group.end();
});