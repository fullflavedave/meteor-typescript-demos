///<reference path="meteor.d.ts"/>
// Lists -- {name: String}

interface ListDAO {
	name:string;
}

var Lists:Meteor.ICollection<ListDAO> = new Meteor.Collection("lists");

// Publish complete set of lists to all clients.
Meteor.publish('lists', function() {
	return Lists.find();
});

// Todos -- {text: String,
//           done: Boolean,
//           tags: [String, ...],
//           list_id: String,
//           timestamp: Number}

interface TodoDAO {
	text:string;
	done:boolean;
	tags:string[];
	list_id:string;
	timestamp:number;
}

var Todos:Meteor.ICollection<TodoDAO> = new Meteor.Collection("todos");

// Publish all items for requested list_id.
Meteor.publish('todos', function(list_id) {
	check(list_id, String);
	return Todos.find({list_id: list_id});
});

