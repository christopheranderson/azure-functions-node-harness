var test = require("tape");
var func = require('../../src/index.js');

test('Queue trigger', function(group){
    var queueFunc = func('queue-func', {dirname: 'tests/test-functions'}); 
    
    group.test('promise should return output on binding', function (t){
        t.plan(1);

        queueFunc.invoke({trigger: {'hello':'world'}}).then(function(context) {
            t.equal("foobar", context.bindings.output);
        }).catch(err => {
            t.fail("Failed because of: " + err)
        });
    });

    group.test('callback should return output on binding', function (t){
        t.plan(1);

        queueFunc.invoke({trigger: {'hello':'world'}}, function(context){
            t.equal("foobar", context.bindings.output);
        });
    });

    group.end();
});
