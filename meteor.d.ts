/**
 *  Draft work - orefalo@yahoo.com
 *
 *
 *
 */

declare module Deps {

	function flush():void;

	class Dependency {

		depend(computation?):boolean;

		changed():void;

		hasDependents():boolean;
	}
}

declare module Npm {

	export function require(module:string);

	export function depends(dependencies:{[id:string]:string});
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
		use(deps:string[], where?:string[]);
		use(deps:string[], where?:string);
		add_files(file:string, where?:string[]);
		add_files(file:string, where?:string);
		add_files(file:string[], where?:string[]);
		add_files(file:string[], where?:string);
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

	add(name:string, func:Function);
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

declare enum HTTPMethod {
	GET,
	POST,
	PUT,
	DELETE
}

interface IHTTPRequest {
	content:string;
	data:any;
	query:string;
	params:{[id:string]:string};
	auth:string;
	headers:{[id:string]:string};
	timeout:number;
	followRedirects:boolean;
}

interface IHTTPResponse {
	statusCode:number;
	content:string;
	data:any;
	headers:{[id:string]:string};
}

interface HTTP {
	call(method:HTTPMethod, url:string, request:IHTTPRequest, callback?:Function):IHTTPResponse;
	get(url:string, request:IHTTPRequest, callback?:Function):IHTTPResponse;
	post(url:string, request:IHTTPRequest, callback?:Function):IHTTPResponse;
	put(url:string, request:IHTTPRequest, callback?:Function):IHTTPResponse;
	del(url:string, request:IHTTPRequest, callback?:Function):IHTTPResponse;
}
declare var HTTP:HTTP;

// Email -----------

interface IEmailMessage {
	from:string;
	to:string[];
	cc?:string[];
	bcc?:string[];
	replyTo:string[];
	subject:string;
	text?:string;
	html?:string;
	headers?:{[id:string]:string};
}

interface Email {
	send(msg:IEmailMessage);
}

declare var Email:Email;

// Assets -----------
interface Assets {

	getText(assetPath:string, callback?:Function):string;
	getBinary(assetPath:string, callback?:Function):EJSON;

}
declare var Assets:Assets;

// Match ------------
export function check(value:any, pattern:any);

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

declare enum IStatus {
	connected,
	connecting,
	failed,
	waiting,
	offline
}

interface IDDPStatus {
	connected:boolean;
	status:IStatus;
	retryCount:number;
	//To turn this into an interval until the next reconnection, use retryTime - (new Date()).getTime()
	retryTime?:number;
	reason?:string;
}

interface IDDP {

	subscribe(name, ...rest);
	call(method:string, ...parameters):void;
	apply(method:string, ...parameters):void;
	methods(IMeteorMethodsDictionary);
	status():IDDPStatus;
	reconnect();
	disconnect();
	onReconnect();
}

interface DDP {
	connect(url:string):IDDP;

}

declare var DDP:DDP;

// DDP ---------------------

interface IUserEmail {
	address:string;
	verified:boolean;
}

interface IUser {
	_id:string;
	username:string;
	emails:IUserEmail[];
	createdAt: number;
	profile: { [id:string]:any };
	services:{ [id:string]:any };
}

// MONGO ----------------

interface IMongoSelector {
	[id:string]:any
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

//declare module Accounts.ui {
//	config(options);
//}

// RANDOM -------------

interface Random {

	fraction():number;
	hexString(digits:number):string;
	id():string;
	choice(arrayOrString:string[]):string;

}

declare var Random:Random;

// TEMPLATE ----------

interface ITemplate {
	rendered:Function;
	created:Function;
	destroyed:Function;
	events(eventMap:IEventMap):void;
	helpers(helpers):void;
	preserve(selectors):void;

}

interface IEventHandler {
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

interface IEventMap {
	[id:string]: (event:IEventHandler, template:TemplateInstance) => boolean
}

interface Template {
	[id:string]:ITemplate;
}
declare var Template:Template;

// METEOR --------------

declare module Meteor {

	var isClient:boolean;
	var isServer:boolean;
	var settings:{[id:string]:any};
	var release:string;

	function apply(method:string, ...parameters):void;

	function absoluteUrl(path:string, options?:IAbsoluteUrlOptions):string;

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

	function renderList(observable:ICursor<any>, docFunc:Function, elseFunc?:Function);

	function reconnect();

	function setTimeout(func:Function, delay:number):number;

	function startup(func:Function);

	function setInterval(func:Function, delay:number):number;

	function subscribe(name, ...rest);

	function status():StatusEnum;

	function user():IUser;

	function users():ICollection<IUser>;

	function userId():string;

	class Error {
		constructor(error:number, reason?:string, details?:string);
	}

//	interface Collection implements ICollection {
	class Collection<T> implements ICollection<T> {

		constructor(name:string, options?:ICollectionOptions);

		ObjectID(hexString?);

		find(selector?:string, options?):ICursor<T>;

		find(selector:IMongoSelector, options?):ICursor<T>;

		findOne(selector:string, options?):T;

		findOne(selector:IMongoSelector, options?):T;

		insert(doc:T, callback?:Function);

		update(selector:string, modifier, options?, callback?:Function);

		update(selector:IMongoSelector, modifier, options?, callback?:Function);

		remove(selector:string, callback?:Function);

		remove(selector:IMongoSelector, callback?:Function);

		allow(options);

		deny(options);
	}

	//Meteor.publish("counts-by-room", function (roomId) {
	//	foo: function () {
	//		var self:meteor.IPublishHandler = <meteor.IPublishHandler>this;
	//		console.log(self.userId);
	//		self.error(new Meteor.Error(123, "bug", "details"));
	//	}
	// );
	interface IPublishHandler {
		userId:string;
		added(collection, id, fields);
		changed(collection, id, fields);
		removed(collection, id);
		ready();
		onStop(func:Function);
		error(error);
		stop();
	}

	interface IMethodsHandler {
		userId:string;
		setUserId(userId:string):void;
		isSimulation():boolean;
		unblock():void;
	}

	interface IAbsoluteUrlOptions {

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

	declare enum ICollectionIdGenerationEnum {
		STRING,
		MONGO
	}

	interface ICollectionOptions {
		connection:any;
		idGeneration:ICollectionIdGenerationEnum;
		transform?:(document)=>any;
	}

	interface ICollection<T> {

		ObjectID(hexString?);

		find(selector?:string, options?):ICursor<T>;
		find(selector:IMongoSelector, options?):ICursor<T>;

		findOne(selector:string, options?):T;
		findOne(selector:IMongoSelector, options?):T;

		insert(doc:T, callback?);

		update(selector:string, modifier, options?, callback?);
		update(selector:IMongoSelector, modifier, options?, callback?);

		remove(selector:string, callback?);
		remove(selector:IMongoSelector, callback?);

		allow(options);
		deny(options);

	}

	interface ICursor<T> {

		forEach(callback:Function);
		map(callback:Function);
		fetch():Array<T>;
		count():number;
		rewind():void;
		observe(callbacks);
		observeChanges(callbacks);

	}

}
