const test = require("tape");
const inputBinder = require('../../src/input-binder');

test('#### Http trigger ####', function (group) {
    group.test('binding pops the parameters off in an array', function (t) {
        const request = {
            method: "POST",
            body: { prop1: "value1" }
        }

        const actual = inputBinder({ req: request });
        const expected = [
            request
        ];

        t.same(actual, expected);
        t.end();
    });

    group.test('binding pops the parameters should be in order', function (t) {
        const request = {
            method: "POST",
            body: { prop1: "value1" }
        }

        const actual = inputBinder({ req: request, inputTwo: "test" });
        const expected = [
            request,
            "test"
        ];

        t.same(actual, expected);
        t.end();
    });

    group.test('handle special trigger http binding', function (t) {
        const requestBody = { prop1: "value1" };

        const actual = inputBinder({ httpTrigger: { reqBody: requestBody } });
        const expected = [
            {
                headers: {},
                originalUrl: "http://node-test-harness",
                params: {},
                query: {},
                method: "POST",
                body: requestBody,
                rawBody: JSON.stringify(requestBody),
            }
        ];

        t.same(actual, expected);
        t.end();
    });

    group.test('handle special trigger http binding with other bindings', function (t) {
        const requestBody = { prop1: "value1" };

        const actual = inputBinder({ httpTrigger: { reqBody: requestBody }, otherBinding: "other data" });
        const expected = [
            {
                headers: {},
                originalUrl: "http://node-test-harness",
                params: {},
                query: {},
                method: "POST",
                body: requestBody,
                rawBody: JSON.stringify(requestBody),
            },
            "other data"
        ];

        t.same(actual, expected);
        t.end();
    });

    group.test('can change http method with special trigger property', function (t) {
        const requestBody = { prop1: "value1" };

        const actual = inputBinder({
            httpTrigger: {
                reqBody: requestBody,
                method: "GET"
            }
        });

        const expected = [
            {
                headers: {},
                originalUrl: "http://node-test-harness",
                params: {},
                query: {},
                method: "GET",
                body: requestBody,
                rawBody: JSON.stringify(requestBody),
            }
        ];

        t.same(actual, expected);
        t.end();
    });

    group.test('can change pass other properties with special Http trigger property', function (t) {
        const requestBody = { prop1: "value1" };
        const headers = {
            accept: 'application/json, */*',
            'content-type': 'application/json'
        };

        const actual = inputBinder({
            httpTrigger: {
                reqBody: requestBody,
                method: "GET",
                headers: headers 
            }
        });

        const expected = [
            {
                headers: headers,
                originalUrl: "http://node-test-harness",
                params: {},
                query: {},
                method: "GET",
                body: requestBody,
                rawBody: JSON.stringify(requestBody),
            }
        ];

        t.same(actual, expected);
        t.end();
    });

    group.end();
});