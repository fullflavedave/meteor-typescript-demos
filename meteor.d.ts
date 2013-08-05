/**
 *  Draft work - orefalo@yahoo.com
 *
 *
 *
 */

interface AbsolutePathOptions {

	// Create an HTTPS URL.
	secure?:boolean;

	// Replace localhost with 127.0.0.1. Useful for services that don't recognize localhost as a domain name.
	replaceLocalhost?:boolean;

	// Override the default ROOT_URL from the server environment. For example: "http://foo.example.com"
	rootUrl?:string;

}

interface Meteor {

	isClient:boolean;
	isServer:boolean;

	settings:{[id:string]:any};

	call(method:string, ...parameters):void;

	startup(func:{():void});

	release():string;

	absoluteUrl(path:string, options?:AbsolutePathOptions):string;

	publish(name:string, func);

	subscribe(name, ...rest);

	methods(name:string, func:any);
}

declare var Meteor:Meteor;

interface Tinytest {

	add(name:string, func:{(test):void});
}

declare var Tinytest:Tinytest;

declare module Deps {

	interface Dependency {
		depend (computation?);
		hasDependents();
		changed();
	}

}

interface Npm {

	require(module:string);
	depends(dependencies:{[id:string]:string});
}

declare var Npm:Npm;

interface PackageDescribeAPI {
	summary: string;
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

interface PackageRegisterExtensionFunction {(bundle:Bundle, source_path:string, serve_path:string, where?:string[]):void}

interface Package {

	describe(metadata:PackageDescribeAPI);
	on_use(func:{(api:Api, where?:string[]):void});
	on_use(func:{(api:Api, where?:string):void});
	on_test(func:{(api:Api):void}) ;
	register_extension(extension:string, callback:PackageRegisterExtensionFunction);

}

declare var Package:Package;

interface EJSON {

	clone(v);
	stringify(item):string;
	parse(item:string):any;
	isBinary(obj):boolean;
	equals(a, b, options?):boolean;
	toJSONValue(item);
	addType(name:string, factory);
	fromJSONValue(item);
}

declare var EJSON:EJSON;
