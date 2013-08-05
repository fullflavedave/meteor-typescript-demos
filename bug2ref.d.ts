
interface IMongoSelector {
	[id:string]:any
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

	forEach(callback);
	map(callback);
	fetch():Array<T>;
	count():number;
	rewind():void;
	observe(callbacks);
	observeChanges(callbacks);

}

interface IMeteorAbsolutePathOptions {

	// Create an HTTPS URL.
	secure?:boolean;

	// Replace localhost with 127.0.0.1. Useful for services that don't recognize localhost as a domain name.
	replaceLocalhost?:boolean;

	// Override the default ROOT_URL from the server environment. For example: "http://foo.example.com"
	rootUrl?:string;

}

interface IUser {
	_id:string;
	username:string;
	emails:IUserEmail[];
	createdAt: number;
	profile: { [id:string]:any };
	services:{ [id:string]:any };
}

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

interface IHtmlFunction {
	():string;
}

interface IDocFunction {
	(doc:{[id:string]:any}):string;
}

interface IUserEmail {
	address:string;
	verified:boolean;
}

declare module Meteor {

	var isClient:boolean;
	var isServer:boolean;
	var settings:{[id:string]:any};
	var release:string;

	class Error {
		constructor(num:number, details:string);
	}

	class Collection {

		constructor(name:string);
	}
	function noConflict():number;

	function startup(func:{():void});

	function absoluteUrl(path:string, options?:IMeteorAbsolutePathOptions):string;

	/**
	 * Publish a record set.
	 *
	 * @param name Name of the attribute set. If null, the set has no name, and the record set is automatically sent to all connected clients.
	 * @param func Function called on the server each time a client subscribes
	 */
	function publish(name:string, func);

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

	function status():IDDPStatus;

	function reconnect();

	function disconnect();

	function onReconnect();

}
