/// <reference path="meteor.d.ts" />
/// <reference path="node.d.ts" />

if (Meteor.isClient) {
  Template['hello']['greeting'] = function () {
    return "Welcome to testCompile.";
  };

  Template['hello'].events(<Meteor.EventMap>{
  'click input' : function() {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
