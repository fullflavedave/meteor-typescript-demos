/**
 *  Draft work - orefalo@yahoo.com
 *
 *
 *
 */

declare module Deps {

	export interface Dependency {
		constructor();
		depend(computation?):boolean;
		changed():void;
		hasDependents():boolean;
	}
}

declare module Npm {

	export function require(module:string);

	export function depends(dependencies:{[id:string]:string});
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

interface Api {
	use(deps:string[], where?:string[]);
	use(deps:string[], where?:string);
	add_files(file:string, where?:string[]);
	add_files(file:string, where?:string);
	add_files(file:string[], where?:string[]);
	add_files(file:string[], where?:string);
}

// PACKAGE --------------------

interface PackageDescribeAPI {
	summary: string;
}

interface PackageRegisterExtensionFunction {(bundle:Bundle, source_path:string, serve_path:string, where?:string[]):void}

interface Package {

	describe(metadata:PackageDescribeAPI);

	on_use(func:{(api:Api, where?:string[]):void});

	on_use(func:{(api:Api, where?:string):void});

	on_test(func:{(api:Api):void}) ;

	register_extension(extension:string, callback:PackageRegisterExtensionFunction);

}

declare var Package:Package;

// TINY TEST --------------------

interface Tinytest {

	add(name:string, func:{(test):void});
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
	call(method:HTTPMethod, url:string, request:IHTTPRequest, callback?):IHTTPResponse;
	get(url:string, request:IHTTPRequest, callback?):IHTTPResponse;
	post(url:string, request:IHTTPRequest, callback?):IHTTPResponse;
	put(url:string, request:IHTTPRequest, callback?):IHTTPResponse;
	del(url:string, request:IHTTPRequest, callback?):IHTTPResponse;
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

	getText(assetPath:string, callback?):string;
	getBinary(assetPath:string, callback?):EJSON;

}
declare var Assets:Assets;

// Match ------------
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

interface IHtmlFunction {
	():string;
}

interface IDocFunction {
	(doc:{[id:string]:any}):string;
}

// MONGO ----------------

interface IMongoSelector {
	[id:string]:any
}

// COLLECTION --------------------

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

	forEach(callback);
	map(callback);
	fetch():Array<T>;
	count():number;
	rewind():void;
	observe(callbacks);
	observeChanges(callbacks);

}

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
	validateNewUser(func);
	onCreateUser(func);
	createUser(options, callback);
	changePassword(oldPassword, newPassword, callback);
	forgotPassword(options, callback);
	resetPassword(token, newPassword, callback);
	setPassword(userId, newPassword);
	verifyEmail(token, callback);
	sendResetPasswordEmail(userId, email);
	sendEnrollmentEmail(userId, email?);
	sendVerificationEmail(userId, email);

}

//declare module Accounts.ui {
//	config(options);
//}

interface Random {

	fraction():number;
	hexString(digits:number):string;
	id():string;
	choice(arrayOrString:string[]):string;

}

declare var Random:Random;

declare module Meteor {


	//Meteor.publish("counts-by-room", function (roomId) {
//	foo: function () {
//		var self:meteor.IPublishHandler = <meteor.IPublishHandler>this;
//		console.log(self.userId);
//		self.error(new Meteor.Error(123, "bug", "details"));
//	}
// );

	var isClient:boolean;
	var isServer:boolean;
	var settings:{[id:string]:any};
	var release:string;

	function startup(func:{():void});

	function absoluteUrl(path:string, options?:IAbsoluteUrlOptions):string;

	/**
	 * Publish a record set.
	 *
	 * @param name Name of the attribute set. If null, the set has no name, and the record set is automatically sent to all connected clients.
	 * @param func Function called on the server each time a client subscribes
	 */
	function publish(name:string, func):ICursor<any>[];

	function user():IUser;

	function users():ICollection<IUser>;

	function userId():string;

	function loggingIn():boolean;

	function logout(callback?);

	function loginWithPassword(user, password:string, callback?);

	function loginWithExternalService(options, callback?);

	function render(htmlFunc:IHtmlFunction);

	function renderList(observable:ICursor<any>, docFunc:IDocFunction, elseFunc?:IHtmlFunction);

	function setTimeout(func:()=>any, delay:number):number;

	function clearTimeout(id:number);

	function setInterval(func:()=>any, delay:number):number;

	function clearInterval(id:number);

	function check(value, pattern);

	function subscribe(name, ...rest);

	function call(method:string, ...parameters):void;

	function apply(method:string, ...parameters):void;

	function methods(IMeteorMethodsDictionary);

	function status():Status;

	function reconnect();

	function disconnect();

	function onReconnect();

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

		insert(doc:T, callback?);

		update(selector:string, modifier, options?, callback?);

		update(selector:IMongoSelector, modifier, options?, callback?);

		remove(selector:string, callback?);

		remove(selector:IMongoSelector, callback?);

		allow(options);

		deny(options);
	}

	interface IPublishHandler {
		userId:string;
		added(collection, id, fields);
		changed(collection, id, fields);
		removed(collection, id);
		ready();
		onStop(func);
		error(error);
		stop();
	}

	enum Status {
		connected,
		connecting,
		failed,
		waiting,
		offline
	}

	interface IAbsoluteUrlOptions {

		// Create an HTTPS URL.
		secure?:boolean;

		// Replace localhost with 127.0.0.1. Useful for services that don't recognize localhost as a domain name.
		replaceLocalhost?:boolean;

		// Override the default ROOT_URL from the server environment. For example: "http://foo.example.com"
		rootUrl?:string;

	}
}
