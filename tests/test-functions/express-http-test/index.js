module.exports = function (context, req) {
    context.res.status(400).json({ test: "test" });
    context.done();
}