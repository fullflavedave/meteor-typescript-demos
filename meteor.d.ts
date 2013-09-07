/**
 *
 *  Meteor definitions for TypeScript
 *  author - orefalo@yahoo.com
 *  supports meteor 0.6.1.1
 *
 */

declare module Deps {

	function flush():void;

	function autorun(func:Function);

	class Dependency {

		depend(computation?):boolean;

		changed():void;

		hasDependents():boolean;
	}
}

declare module Npm {

	function require(module:string);

	function depends(dependencies:{[id:string]:string});
}

// PACKAGE --------------------

declare module Package {

	function describe(metadata:PackageDescribeAPI);

	function on_use(func:{(api:Api, where?:string[]):void});

	function on_use(func:{(api:Api, where?:string):void});

	function on_test(func:{(api:Api):void}) ;

	function register_extension(extension:string, options:PackageRegisterExtensionOptions);

	interface PackageRegisterExtensionOptions {(bundle:Bundle, source_path:string, serve_path:string, where?:string[]):void}
	interface PackageDescribeAPI {
		summary: string;
	}

	interface Api {
		export(variable:string);
		export(variables:string[]);
        use(deps:string, where?:string[]);
        use(deps:string, where?:string);
		use(deps:string[], where?:string[]);
		use(deps:string[], where?:string);
		add_files(file:string, where?:string[]);
		add_files(file:string, where?:string);
		add_files(file:string[], where?:string[]);
		add_files(file:string[], where?:string);
		imply(package:string);
		imply(packages:string[]);
	}

	interface BundleOptions {
		type: string;
		path: string;
		data: any;
		where: string[];
	}

	interface Bundle {
		add_resource(options:BundleOptions);
		error(diagnostics:string);
	}

}

// TINY TEST --------------------

interface Tinytest {

//	Tinytest.addAsync("Add object to a collection", function(test, next) {
//	var people = new Meteor.Collection("people");
//	people.insert({"name": "Andrew"}, function(error, id) {
//	test.isNull(error);
//	next();
//});
//});


	add(name:string, func:Function);
	addAsync(name:string, func:Function);
}

declare var Tinytest:Tinytest;

// EJSON --------------

interface EJSON {

	parse(item:string):EJSON;

	stringify(item):string;

	fromJSONValue(item):any;

	toJSONValue(item):any;

	equals(a, b, options?):boolean;

	clone<T>(v:T):T;

	newBinary(size:number):any;

	isBinary(obj):boolean;

	addType(name:string, factory):void;

}

declare var EJSON:EJSON;

// HTTP ---------------

declare module HTTP {
	function call(method:HTTPMethodEnum, url:string, request:HTTPRequest, callback?:Function):HTTPResponse;

	function get(url:string, request:HTTPRequest, callback?:Function):HTTPResponse;

	function post(url:string, request:HTTPRequest, callback?:Function):HTTPResponse;

	function put(url:string, request:HTTPRequest, callback?:Function):HTTPResponse;

	function del(url:string, request:HTTPRequest, callback?:Function):HTTPResponse;

	enum HTTPMethodEnum {
		GET,
		POST,
		PUT,
		DELETE
	}

	interface HTTPRequest {
		content:string;
		data:any;
		query:string;
		params:{[id:string]:string};
		auth:string;
		headers:{[id:string]:string};
		timeout:number;
		followRedirects:boolean;
	}

	interface HTTPResponse {
		statusCode:number;
		content:string;
		data:any;
		headers:{[id:string]:string};
	}
}

// Email -----------

declare module Email {
	function send(msg:EmailMessage);

	interface EmailMessage {
		from:string;

		// damn it, this should really be string ot string[]
		to:any;

		// damn it, this should really be string ot string[]
		cc?:any;

		// damn it, this should really be string ot string[]
		bcc?:any;

		// damn it, this should really be string ot string[]
		replyTo:any;
		subject:string;
		text?:string;
		html?:string;
		headers?:{[id:string]:string};
	}
}

// Assets -----------
interface Assets {

	getText(assetPath:string, callback?:Function):string;
	getBinary(assetPath:string, callback?:Function):EJSON;

}
declare var Assets:Assets;

// Match ------------
declare function check(value:any, pattern:any);

interface Match {

	test(value, pattern)
	Any;
	Integer;
	Optional(pattern):boolean;
	ObjectIncluding(dico):boolean;
	OneOf(...patterns);
	Where(condition);

}
declare var Match:Match;

// DDP ---------------------

declare module DDP {

	interface DDPStatic {

		subscribe(name, ...rest);
		call(method:string, ...parameters):void;
		apply(method:string, ...parameters):void;
		methods(IMeteorMethodsDictionary);
		status():DDPStatus;
		reconnect();
		disconnect();
		onReconnect();
	}

	enum DDPStatusEnum {

		connected,
		connecting,
		failed,
		waiting,
		offline

	}

	interface DDPStatus {

		connected:boolean;
		status:DDPStatusEnum;
		retryCount:number;
		//To turn this into an interval until the next reconnection, use retryTime - (new Date()).getTime()
		retryTime?:number;
		reason?:string;

	}

	function connect(url:string):DDPStatic;

}

// COLLECTION --------------------

// SESSION -----------

interface Session {

	set(key:string, value):void;
	setDefault(key:string, value):void;
	get(key:string);
	equals(key:string, value):boolean;

}

declare var Session:Session;

// ACCOUNTS ----------

interface Accounts {

	emailTemplates;
	ui;

	config(options);
	validateNewUser(func:Function);
	onCreateUser(func:Function);
	createUser(options, callback:Function);
	changePassword(oldPassword:string, newPassword:string, callback:Function);
	forgotPassword(options, callback:Function);
	resetPassword(token, newPassword:string, callback:Function);
	setPassword(userId:string, newPassword:string);
	verifyEmail(token, callback:Function);
	sendResetPasswordEmail(userId:string, email:string);
	sendEnrollmentEmail(userId:string, email?:string);
	sendVerificationEmail(userId:string, email:string);

}
declare var Accounts:Accounts;

//declare module Accounts.ui {
//	config(options);
//}

// RANDOM -------------

interface Random {

	fraction():number;

	/**
	 *
	 * @param numberOfDigits
	 * @returns a random hex string of the given length
	 */
	hexString(numberOfDigits:number):string;

	/**
	 * @returns an id
	 */
	id():string;
	/**
	 *
	 * @param array
	 * @return a random element in array
	 */
	choice(array:any[]):string;
	/**
	 *
	 * @param str
	 * @return a random char in str
	 */
	choice(str:string):string;

}

declare var Random:Random;

// METEOR --------------

declare module Meteor {

	var isClient:boolean;
	var isServer:boolean;
	var settings:{[id:string]:any};
	var release:string;
	var users:Meteor.Collection<User>;

	function apply(method:string, ...parameters):void;

	function absoluteUrl(path?:string, options?:AbsoluteUrlOptions):string;

	function call(method:string, ...parameters):void;

	function clearTimeout(id:number);

	function clearInterval(id:number);

	function check(value, pattern);

	function disconnect();

	function loggingIn():boolean;

	function logout(callback?);

	function loginWithPassword(user, password:string, callback?);

	function loginWithExternalService(options, callback?);

	function methods(IMeteorMethodsDictionary);

	function onReconnect();

	/**
	 * Publish a record set.
	 *
	 * @param name Name of the attribute set. If null, the set has no name, and the record set is automatically sent to all connected clients.
	 * @param func Function called on the server each time a client subscribes
	 */
	function publish(name:string, func:Function):void;

	function render(htmlFunc:Function);

	function renderList(observable:Meteor.Cursor<any>, docFunc:Function, elseFunc?:Function);

	function reconnect();

	function setTimeout(func:Function, delay:number):number;

	function startup(func:Function);

	function setInterval(func:Function, delay:number):number;

	function subscribe(name, ...rest);

	function status():Meteor.StatusEnum;

	function user():User;

//	function users():Collection<User>;

	function userId():string;

	class Error {
		constructor(error:number, reason?:string, details?:string);
	}

	interface AllowDenyOptions {

		insert?: (userId:string, doc) => boolean;
		update?: (userId, doc, fieldNames, modifier) => boolean;
		remove?: (userId, doc) => boolean;
		fetch?: string[];
		transform?: Function;

	}

	class Collection<T> {

		constructor(name:string, options?:Meteor.CollectionOptions);

		ObjectID(hexString?:any);

		find(selector?:any, options?):Meteor.Cursor<T>;

		findOne(selector?, options?):T;

		insert(doc:T, callback?:Function):string;

		update(selector:any, modifier, options?, callback?:Function);

		remove(selector:any, callback?:Function);

		allow(options:Meteor.AllowDenyOptions);

		deny(options);
	}

	//Meteor.publish("counts-by-room", function (roomId) {
	//	foo: function () {
	//      // until TS provides a way to hook this:any
	//		var self:meteor.IPublishHandler = <meteor.IPublishHandler>this;
	//		console.log(self.userId);
	//		self.error(new Meteor.Error(123, "bug", "details"));
	//	}
	// );
	interface PublishHandler {
		userId:string;
		added(collection, id, fields);
		changed(collection, id, fields);
		removed(collection, id);
		ready();
		onStop(func:Function);
		error(error);
		stop();
	}

	interface MethodsHandler {
		userId:string;
		setUserId(userId:string):void;
		isSimulation():boolean;
		unblock():void;
	}

	interface AbsoluteUrlOptions {

		// Create an HTTPS URL.
		secure?:boolean;

		// Replace localhost with 127.0.0.1. Useful for services that don't recognize localhost as a domain name.
		replaceLocalhost?:boolean;

		// Override the default ROOT_URL from the server environment. For example: "http://foo.example.com"
		rootUrl?:string;

	}

	enum StatusEnum {
		connected,
		connecting,
		failed,
		waiting,
		offline
	}

	enum CollectionIdGenerationEnum {
		STRING,
		MONGO
	}

	interface CollectionOptions {
		connection:any;
		idGeneration:Meteor.CollectionIdGenerationEnum;
		transform?:(document)=>any;
	}

	interface Cursor<T> {

		forEach(callback:Function);
		map(callback:Function);
		fetch():Array<T>;
		count():number;
		rewind():void;
		observe(callbacks);
		observeChanges(callbacks);

	}

	// TEMPLATE ------

	interface TemplateDico {
		[id:string]:Meteor.Template;
	}

	interface Template {
		rendered:Function;
		created:Function;
		destroyed:Function;
		events(eventMap:Meteor.EventMap):void;
		helpers(helpers):void;
		preserve(selectors):void;

	}

	interface EventHandler {
		type:string;
		target:HTMLElement;
		currentTarget:HTMLElement;
		which: number;
		stopPropagation():void;
		stopImmediatePropagation():void;
		preventDefault():void;
		isPropagationStopped():boolean;
		isImmediatePropagationStopped():boolean;
		isDefaultPrevented():boolean;
	}

	interface TemplateInstance {
		findAll(selector);
		find(selector);
		firstNode:HTMLElement;
		lastNode:HTMLElement;
		data:any;
	}

	interface EventMapFunction extends Function {
		(event?:Meteor.EventHandler, template?:Meteor.TemplateInstance):any;
	}

	interface EventMap {
		[id:string]:Function;
	}

	// USER ---------------------

	interface UserEmail {
		address:string;
		verified:boolean;
	}

	interface User {
		_id:string;
		username:string;
		emails:Meteor.UserEmail[];
		createdAt: number;
		profile: any;
		services: any;
	}
}

// TEMPLATE ----------

declare var Template:Meteor.TemplateDico;

