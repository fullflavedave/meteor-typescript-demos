/// <reference path="../meteor.d.ts"/>
/// <reference path="collections.d.ts"/>

Todos = <Meteor.Collection<TodoDAO>> new Meteor.Collection("todos");
Lists = <Meteor.Collection<ListDAO>> new Meteor.Collection("lists");