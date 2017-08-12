const requestBuilder = require('./request-builder'),
    methods = require('./method');

module.exports = function (data) {
    const out = [];

    for (const name in data) {
        if (name === "httpTrigger") {
            const triggerInfo = data["httpTrigger"];

            let reqBody = {};
            let method = methods.post;
            let otherProps = {};
            
            Object.keys(triggerInfo).forEach(key => {
                if (key === "reqBody") {
                    reqBody = triggerInfo[key];
                }else if(key === "method"){
                    method = triggerInfo[key];
                }else{
                    otherProps[key] = triggerInfo[key];
                }
            });

            out.push(requestBuilder.create(reqBody,method, otherProps));
        } else {
            out.push(data[name]);
        }
    }
    return out;
}