///<reference path="../../lib.d.ts"/>
///<reference path="../../meteor.d.ts"/>
///<reference path="../../backbone.d.ts"/>
///<reference path="../../underscore.d.ts"/>
///<reference path="../collections.d.ts"/>

// Client-side JavaScript, bundled and sent to client.

// Define Minimongo collections to match server/publish.js.

// ID of currently selected list
Session.setDefault('list_id', null);

// Name of currently selected tag for filtering
Session.setDefault('tag_filter', null);

// When adding tag to a todo, ID of the todo
Session.setDefault('editing_addtag', null);

// When editing a list name, ID of the list
Session.setDefault('editing_listname', null);

// When editing todo text, ID of the todo
Session.setDefault('editing_itemname', null);

// Subscribe to 'lists' collection on startup.
// Select a list once data has arrived.
var listsHandle = Meteor.subscribe('lists', function() {
	if (!Session.get('list_id')) {
		var list:ListDAO = Lists.findOne({}, {sort: {name: 1}});
		if (list)
			Router.setList(list._id);
	}
});

var todosHandle = null;
// Always be subscribed to the todos for the selected list.
Deps.autorun(function() {
	var list_id = Session.get('list_id');
	if (list_id)
		todosHandle = Meteor.subscribe('todos', list_id);
	else
		todosHandle = null;
});

////////// Helpers for in-place editing //////////

// Returns an event map that handles the "escape" and "return" keys and
// "blur" events on a text input (given by selector) and interprets them
// as "ok" or "cancel".
var okCancelEvents = function(selector:string, callbacks):Meteor.EventMap {
	var ok:Meteor.EventMapFunction = callbacks.ok || function() {};
	var cancel:Meteor.EventMapFunction = callbacks.cancel || function() {};

	var events:Meteor.EventMap = <Meteor.EventMap>{};
	events['keyup ' + selector + ', keydown ' + selector + ', focusout ' + selector] =
		<Meteor.EventMapFunction>function(evt:Meteor.EventHandler) {
			if (evt.type === "keydown" && evt.which === 27) {
				// escape = cancel
				cancel.call(this, evt);

			} else if (evt.type === "keyup" && evt.which === 13 ||
				evt.type === "focusout") {
				// blur/return/enter = ok/submit if non-empty
				var value = String((<HTMLInputElement>evt.target).value || "");
				if (value)
					ok.call(this, value, evt);
				else
					cancel.call(this, evt);
			}
		};

	return events;
};

var activateInput = function(input) {
	input.focus();
	input.select();
};

////////// Lists //////////

Template['lists']['loading'] = function() {
	return !listsHandle.ready();
};

Template['lists']['lists'] = function() {
	return Lists.find({}, {sort: {name: 1}});
};

var em:Meteor.EventMap = <Meteor.EventMap>{};

em['mousedown .list'] = <Meteor.EventMapFunction>function(evt:Meteor.EventHandler) {
	// select list
	Router.setList(this._id);
};

em['click .list'] = <Meteor.EventMapFunction>function(evt:Meteor.EventHandler) {
	// prevent clicks on <a> from refreshing the page.
	evt.preventDefault();
};

em['dblclick .list'] = <Meteor.EventMapFunction>function(evt:Meteor.EventHandler, template:Meteor.TemplateInstance) { // start editing list name
	Session.set('editing_listname', this._id);
	Deps.flush(); // force DOM redraw, so we can focus the edit field
	activateInput(template.find("#list-name-input"));
};

Template['lists'].events(em);

// Attach events to keydown, keyup, and blur on "New list" input box.
Template['lists'].events(okCancelEvents(
	'#new-list',
	{
		ok: function(text:string, evt:Meteor.EventHandler) {
			console.log(text);
			var id = Lists.insert({name: text});
			Router.setList(id);
			(<HTMLInputElement>evt.target).value = "";
		}
	}));

Template['lists'].events(okCancelEvents(
	'#list-name-input',
	{
		ok: function(value) {
			Lists.update(this._id, {$set: {name: value}});
			Session.set('editing_listname', null);
		},
		cancel: function() {
			Session.set('editing_listname', null);
		}
	}));

Template['lists']['selected'] = function():string {
	return Session.equals('list_id', this._id) ? 'selected' : '';
};

Template['lists']['name_class'] = function():string {
	return this.name ? '' : 'empty';
};

Template['lists']['editing'] = function():boolean {
	return Session.equals('editing_listname', this._id);
};

////////// Todos //////////

Template['todos']['loading'] = function():boolean {
	return todosHandle && !todosHandle.ready();
};

Template['todos']['any_list_selected'] = function():boolean {
	return !Session.equals('list_id', null);
};

Template['todos'].events(okCancelEvents(
	'#new-todo',
	{
		ok: function(text:string, evt:Meteor.EventHandler) {
			var tag = Session.get('tag_filter');
			Todos.insert({
				text: text,
				list_id: Session.get('list_id'),
				done: false,
				timestamp: (new Date()).getTime(),
				tags: tag ? [tag] : []
			});
			(<HTMLInputElement>evt.target).value = "";
		}
	}));

Template['todos']['todos'] = function():Meteor.Cursor<TodoDAO> {
	// Determine which todos to display in main pane,
	// selected based on list_id and tag_filter.

	var list_id = Session.get('list_id');
	if (!list_id)
		return Meteor.Cursor();

	var selector:any = {list_id: list_id};
	var tag_filter = Session.get('tag_filter');
	if (tag_filter)
		selector.tags = tag_filter;

	return Todos.find(selector, {sort: {timestamp: 1}});
};

Template['todo_item']['tag_objs'] = function() {
	var todo_id = this._id;
	return _.map(this.tags || [], function(tag) {
		return {todo_id: todo_id, tag: tag};
	});
};

Template['todo_item']['done_class'] = function():string {
	return this.done ? 'done' : '';
};

Template['todo_item']['done_checkbox'] = function():string {
	return this.done ? 'checked="checked"' : '';
};

Template['todo_item']['.editing'] = function():boolean {
	return Session.equals('editing_itemname', this._id);
};

Template['todo_item']['adding_tag'] = function():boolean {
	return Session.equals('editing_addtag', this._id);
};

em = <Meteor.EventMap>{};

em['click .check'] = <Meteor.EventMapFunction>function():void {
	Todos.update(this._id, {$set: {done: !this.done}});
};

em['click .destroy'] = <Meteor.EventMapFunction>function():void {

	Todos.remove(this._id);
};

em['click .addtag'] = <Meteor.EventMapFunction>function(evt:Meteor.EventHandler, tmpl:Meteor.TemplateInstance) {
	Session.set('editing_addtag', this._id);
	Deps.flush(); // update DOM before focus
	activateInput(tmpl.find("#edittag-input"));
};

em['dblclick .display .todo-text'] = <Meteor.EventMapFunction>function(evt:Meteor.EventHandler, tmpl:Meteor.TemplateInstance) {
	Session.set('editing_itemname', this._id);
	Deps.flush(); // update DOM before focus
	activateInput(tmpl.find("#todo-input"));
};

em['click .remove'] = <Meteor.EventMapFunction>function(evt:Meteor.EventHandler) {
	var tag = this.tag;
	var id = this.todo_id;

	(<HTMLElement>evt.target.parentNode).style.opacity = "0";

	// wait for CSS animation to finish
	Meteor.setTimeout(function() {
		Todos.update({_id: id}, {$pull: {tags: tag}});
	}, 300);
};

Template['todo_item'].events(em);

Template['todo_item'].events(okCancelEvents(
	'#todo-input',
	{
		ok: function(value) {
			Todos.update(this._id, {$set: {text: value}});
			Session.set('editing_itemname', null);
		},
		cancel: function() {
			Session.set('editing_itemname', null);
		}
	}));

Template['todo_item'].events(okCancelEvents(
	'#edittag-input',
	{
		ok: function(value) {
			Todos.update(this._id, {$addToSet: {tags: value.toString}});
			Session.set('editing_addtag', null);
		},
		cancel: function() {
			Session.set('editing_addtag', null);
		}
	}));

////////// Tag Filter //////////

// Pick out the unique tags from all todos in current list.
Template['tag_filter']['tags'] = function() {
	var tag_infos = [];
	var total_count = 0;

	Todos.find({list_id: Session.get('list_id')}).forEach(function(todo) {
		_.each(todo.tags, function(tag) {
			var tag_info = _.find(tag_infos, function(x) { return x.tag === tag; });
			if (!tag_info)
				tag_infos.push({tag: tag, count: 1});
			else
				tag_info.count++;
		});
		total_count++;
	});

	tag_infos = _.sortBy(tag_infos, function(x) { return x.tag; });
	tag_infos.unshift({tag: null, count: total_count});

	return tag_infos;
};

Template['tag_filter']['tag_text'] = function() {
	return this.tag || "All items";
};

Template['tag_filter']['selected'] = function() {
	return Session.equals('tag_filter', this.tag) ? 'selected' : '';
};

em = <Meteor.EventMap>{};

em['mousedown .tag'] = <Meteor.EventMapFunction> function() {
	if (Session.equals('tag_filter', this.tag))
		Session.set('tag_filter', null);
	else
		Session.set('tag_filter', this.tag);
};

Template['tag_filter'].events(em);

////////// Tracking selected list in URL //////////

var TodosRouter = Backbone.Router.extend({
	routes: {
		":list_id": "main"
	},
	main: function(list_id) {
		var oldList = Session.get("list_id");
		if (oldList !== list_id) {
			Session.set("list_id", list_id);
			Session.set("tag_filter", null);
		}
	},
	setList: function(list_id) {
		this.navigate(list_id, true);
	}
});

var Router = new TodosRouter;

Meteor.startup(function() {
	Backbone.history.start({pushState: true});
});
