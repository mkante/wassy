#Wassy


Wassy is a declarative REST client for Javascript. It's similar to Netflix Feign. 
> Wassy can not be use for server side node development since it's dependent to jQuery

###Installation

`$npm install wassy `

###Usage
First you need to map your URL (end point) to a Model

```
var Wassy = require('wassy');
var User = Wassy.Model.extends({
      config: {
        url: '/users',
        headers: {
          Accept: 'text/json',
        }
      }
    });

```
#####Make a request
Making a POST / GET / GET / DELETE couldn't be easier

```
var promise  = User.request().post() ;

// With parameters
var promise  = User.request().post({ name: 'wassy' }) ;

```
To send custom HTTP method

```
...
var promise  = User.request().send('PING') ;
...

// Send with parameters
var promise  = 
	User.request()
		.send('PING', {
			email: 'some@nowhere.com'
		}) ;

```
#####Response

Under the hood Wassy request builder uses JQuery Ajax `$.ajax({ ... }) ` so each request is returning a Promise. 

```
...
var promise = User.request().post() ;

promise.done(function( myModel ) {
		alert( "success" );
	})
	.fail(function(response) {
    	alert( "error" );
	})
	.always(function(myModel) {
		alert( "complete" );
	});
```
Promise callbacks —` .done(), .fail(), .always(), and .then() `— are invoked, in the order they are registered.

In a successful response the first argument passed to your callback is an instance of the Model and the second is raw response

Example:

```
...
var promise = User.request().post() ;
promise.done(function( myModel ) {
		
		// myModel is an instance to User model
		alert( myModel.get('id') )
	})
	
```


#####URL paramters binding
Sometimes you need to have dynamic parameters inside URL. For example 
`/users/2` or `/users/232/comments/10`

```
...
var Comment = Wassy.Model.extends({
      config: {
        url: '/users/{userId}/comments/{comId}',
      }
    });
    
var promise = 
	Comment.request({ userId: 43, comId: 100 }).get() ;

```
Binding parameters are not always numbers they can be string.


```
...
var promise = 
	User.request({ state: 'active' }).get() ;

```


#####Send headers

You can define the default headers during the Model declaration.

```
...
var User = Wassy.Model.extends({
      config: {
        url: '/users',
        headers: {
          Accept: 'text/json',
        }
      }
    });

```
You will define or override default headers during request

```
var promise = 
	User.request()
		.get(
			{ id: 12}, 
			{ 'Access Token': 'tk_ewew494834384939sasa' }
		);

```

###Config options

######baseUrl (default: '' )
> Type: String

######url (default: '/' )
> Type: String

######cache (default: true )
> Type: Boolean

######headers (default: {} )
> Type: Object

######statusCode (default: {} )
> Type: Object

######testing (default: false )
> Type: Boolean

######onBeforeRequest (default: null )
> Type: Function

TODO
-

Document the following features:

- Model custom attributes and method
- Model inheretance and configuration overriding- 
- Before request hook
- Global config options
- Response status code handling






