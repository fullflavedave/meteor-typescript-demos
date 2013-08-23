/// <reference path="../meteor.d.ts"/>

interface TodoDAO {
	_id?:string;
	text:string;
	done:boolean;
	tags:string[];
	list_id:string;
	timestamp:number;
}

var Todos:Meteor.ICollection<TodoDAO> = <Meteor.ICollection<TodoDAO>> new Meteor.Collection("todos");

interface ListDAO {
	_id?:string;
	name:string;
}

var Lists:Meteor.ICollection<ListDAO> = <Meteor.ICollection<ListDAO>> new Meteor.Collection("lists");