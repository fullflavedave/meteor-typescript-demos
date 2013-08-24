/// <reference path="../meteor.d.ts"/>
/// <reference path="collections.d.ts"/>

Todos = <Meteor.ICollection<TodoDAO>> new Meteor.Collection("todos");
Lists = <Meteor.ICollection<ListDAO>> new Meteor.Collection("lists");