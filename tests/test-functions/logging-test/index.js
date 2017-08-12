module.exports = function(context) {
    context.log("simple log");
    context.log.info("info log");
    context.log.error("error log");
    context.log.warn("warn log");
    context.log.verbose("verbose log");

    context.done();
}