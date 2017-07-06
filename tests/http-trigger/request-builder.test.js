const test = require("tape"),
    requestBuilder = require('../../src/request-builder'),
    methods = require('../../src/method');


test('#### request builder tests ####', function(group){   
    group.test('should return full request body and rawBody filled', function (t){
        const actual = requestBuilder.create('body');
        const expected = {
            headers: {},
            originalUrl: "http://node-test-harness",
            params: {},
            query: {},
            method: "POST",
            body: "body",
            rawBody: '"body"',
        }

        t.same(actual, expected);
        t.end();
    });

    group.test('should serialize json', function (t){
        const body =  {
            test: "test"
        };

        const actual = requestBuilder.create(body);
        const expected = {
            headers: {},
            originalUrl: "http://node-test-harness",
            params: {},
            query: {},
            method: "POST",
            body: body,
            rawBody: JSON.stringify(body),
        }

        t.same(actual, expected);
        t.end();
    });

    group.test('can overload the method', function (t){
        const actual = requestBuilder.create({}, methods.get);
        const expected = {
            headers: {},
            originalUrl: "http://node-test-harness",
            params: {},
            query: {},
            method: "GET",
            body: {},
            rawBody: '{}',
        }

        t.same(actual, expected);
        t.end();
    });

    
    group.test('can overload other props', function (t){
        var headers = {
            accept: 'application/json, */*',
            'content-type': 'application/json'
        }

        const actual = requestBuilder.create({}, methods.get, {headers});
        const expected = {
            headers: headers,
            originalUrl: "http://node-test-harness",
            params: {},
            query: {},
            method: "GET",
            body: {},
            rawBody: '{}',
        }

        t.same(actual, expected);
        t.end();
    });

});
