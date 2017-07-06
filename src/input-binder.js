const requestBuilder = require('./request-builder');

module.exports = function (data){
    return (function(data) {

        var out = [];
        for(var name in data) {
            if (name === 'requestBody'){
                out.push(requestBuilder.create(data[name]));
            }else{
                out.push(data[name]);
            }
        }
        return out;
    })(data);
}