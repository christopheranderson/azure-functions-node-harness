const methods = require("./method");

module.exports = {
    create: function (body, method = methods.post, props = {}) {
        props.body = body;
        props.rawBody = JSON.stringify(body);
        props.method = method;

        return Object.assign({}, defaultRequest, props);
    }
}

const defaultRequest = {
    headers: {},
    originalUrl: "http://node-test-harness",
    params: {},
    query: {},
    method: "POST",
    body: {},
    rawBody: "",
}
