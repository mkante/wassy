#Wassy


A smart REST data access library for Javascript.

###Installation

`$npm install wassy `


###Usage
First you need to map your URL (end point) to a Model

```
var Endpoint = require('wassy').Endpoint;
var User = Endpoint({
        host: 'https://api.domain.com',
        uri: '/users',
        headers: {
            Accept: 'text/json',
        }
    });

```
#####Make a request
Making a POST / GET / GET / DELETE couldn't be easier

```
var promise  = new User().post() ;

// With parameters
var promise  = new User().post({ name: 'wassy' }) ;

```
To send custom HTTP method

```
...
var promise  = new User().send('PING') ;
...

// Send with parameters
var promise  = 
    new User()
        .send('PING', {
            email: 'some@nowhere.com'
        }) ;

```
#####Response

```
...
var promise = new User().post() ;

promise.then(function( response ) {
        console.log( "success" );
	})
	.catch(function(err) {
    	console.log( "error" );
	})
	.finaly(function() {
		console.log( "complete" );
	});
```


Example:

```
...
var promise = new User().post() ;
promise.then(function( response ) {
		console.log( response.model.get('id') )
	})
	
```


#####URL paramters binding
Sometimes you need to have dynamic parameters inside URL. For example 
`/users/2` or `/users/232/comments/10`

```
...
var Comment = Endpoint({
        host: 'https://api.domain.com',
        uri: '/users/{userId}/comments/{comId}',
    });
    
var promise = 
	new Comment({ userId: 43, comId: 100 }).get() ;

```
Binding parameters are not always numbers they can be string.


```
...
var promise = 
	new User({ state: 'active' }).get() ;

```


#####Send headers

You can define the default headers during the Model declaration.

```
...
var User = Endpoint({
        uri: '/users',
        headers: {
            Accept: 'text/json',
        }
    });

```
You will define or override default headers during request

```
var promise = 
	new User()
        .get(
			{ id: 12}, 
			{ 'Access Token': 'tk_ewew494834384939sasa' }
		);

```

###Config options

######host (default: 'http://localhost' )
> Type: String

######uri (default: '/' )
> Type: String

######cache (default: true )
> Type: Boolean

######headers (default: {} )
> Type: Object

###### postRequest (default: {} )
> Type: Object

###### preRequest (default: null )
> Type: Function


TODO
-

Document the following features:

- Model custom attributes and method
- Endpoint inheritance and configuration overriding
- Before request hook
- Response status code handling






