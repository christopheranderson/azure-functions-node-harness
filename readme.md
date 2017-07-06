# Azure Functions Node Harness

> :construction: This library is still in alpha and not supported by the Azure Functions team for any use. :construction:

Easily invoke your Functions from test harnesses, etc.

## Install
coming soon to npm. for now clone and use as local module.

## Usage

```javascript
var func = require('azure-functions-node-harness');

var queueFunc = func('queue'); // Optional config: , {dirname: __dirname}); 
var invocation = queueFunc.invoke({'hello':'world'});

invocation.then(function(context) {
    // validate result 
    if (context.bindings.out == "somevalue"){
        console.log("success");
    }
})
```

### `FunctionsHarness(nameOrPath: string, [config: Object])`

```javascript
var func = require('azure-functions-node-harness');

var queueFunc = func('queue'); // Optional config: , {dirname: __dirname}); 
var httpFunc = new func('queue'); //same thing - supports new and factory idioms
```

#### Parameters
 - nameOrPath: string
    - Selects the name or path you want to load. Uses node module loading logic (i.e. `queue` will look for `./queue/index.js`, )
 - config: Object
    - Helps adjust settings. Mostly advanced features.
    - Properties:
        - dirname: string
            - Which directory to look in for functions. Useful when tests are in a different directory than sample functions.
        - moduleConfig: object
            - instead of looking up function you can pass a function and it's function.json manually. mostly used internally.          

### `#.invoke(data: Object, [cb: function])`

```javascript
var func = require('azure-functions-node-harness');

var queueFunc = func('queue');

// Supports callbacks
queueFunc.invoke({parameterName: {'hello':'world'}}, function(err, results) {
    // add results handling logic here
};

// Returns a promise if no callback is given
var invocation = queueFunc.invoke({parameterName: {'hello':'world'}});
invocation.then(function(context){
    // success logic here
}).catch(function(err){
    // failure logic here
})

```

#### Parameters
 - data
    - Key-value list of inputs. Use the name of your bindings for the keys
 - cb
    - Optionally give a callback for your Function. If you don't, the function will return a Promise.

### `#.invokeHttpTrigger(httpTriggerData,data: Object, [cb: function])` 
Invoke http trigger functions.  It is possible to use the `invoke` to get the same results but this simplifies the building of the request object.

```javascript
var httpFunction = func('httpfunc');

// Supports callbacks
httpFunction.invokeHttpTrigger({ 
    reqBody: requestBody,
    method: "POST",  //optional
    headers: headers //optional, along with any other request parameters you might want to tweak
 }, {parameterName: "another parameter"}).then(context => {
    // do test validations here.
});
```
#### Parameters
- httpTrigger
    - object with reqBody.  Simplifies building the entire http request object. Can override any parameters like `headers`.
- data
    - Key-value list of other inputs. Use the name of your bindings for the keys
- cb
    - Optionally give a callback for your Function. If you don't, the function will return a Promise.

## Using with test frameworks (coming soon...)

The general idea is to set up the function once then call invoke in each test. If you use chai and chai-as-promised, you should be able to have some nifty assertions.

### [mocha](https://mochajs.org/) 
coming soon

### [chai](http://chaijs.com/)
coming soon

### [chai-as-promised](https://github.com/domenic/chai-as-promised)
coming soon
 
### [tape](https://github.com/substack/tape)

Your test file would look like:

```javascript
var test = require('tape');
var funcHarness = require('azure-functions-node-harness');

test('Tests', function (group) {
    var funcToTest = funcHarness('NameOfFunction', { dirname: 'foldername-functions-live-in' });

    group.test('test to run', function (t) {
        t.plan(1);

        funcToTest.invoke({
            data: {}
        }).then(context => {
            t.equal("yippee!", context.binding.output);
        }).catch(err =>{
            t.fail(`something went wrong during test: ${err}`);
        });
});
```

## Build
Clone this repository then run:

```
npm install 
npm test
```

## License

[MIT](LICENSE)