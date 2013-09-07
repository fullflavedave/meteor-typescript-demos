declare module Mesophere {
    Mesosphere.registerAggregate = function (name, fn) {
        if (Mesosphere.Aggregates[name]) {
            throw new Error(name + " is already defined as a aggregate.");
        }
        Mesosphere.Transforms[name] = fn;
    };

    Mesosphere.registerFormat = function (name, fn) {
        if (Mesosphere.Formats[name]) {
            throw new Error(name + " is already defined as a format.");
        }
        Mesosphere.Formats[name] = fn;
    };

    Mesosphere.registerRule = function (name, fn) {
        if (Mesosphere.Rules[name]) {
            throw new Error(name + " is already defined as a rule.");
        }
        Mesosphere.Rules[name] = fn;
    };

    Mesosphere.registerTransform = function (name, fn) {

}