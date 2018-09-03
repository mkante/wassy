# Wassy

Wassy allows you to abstract RESTfull endpoints into POJOs.

### Install

```bash
npm install wassy 
```

**CDN**

```
https://cdn.jsdelivr.net/npm/wassy@2.0.0
```


### Get Started
The easier way to understand Wassy design is to image the ORM pattern but instead of mapping POJOs to database table record, you are mapping Http endpoint to a POJO. One endpoint, one POJO.

The first step is to define an endpoint

```javascript
import Endpoint from 'wassy';

var UsersEP = Endpoint.define({
        host: 'https://api.domain.com',
        uri: '/users'
      });
```
After you create an endpoint instance to send your request

```javascript
var user = new UsersEP();

user.get()
  .then((resp) => {
     // handle response
  }).catch((err) => {
    // handle error
  });

```
All the known HTTP methods (GET/POST/PUT/DELETE/HEAD) are mapped to functions `get, post, put, delete, head`. There is a `send` function if you need to send a custom method

```javascript
var promise  = user.send('PING');
```
That's everything you need to know for a basic usage, easy right? But there's more and if you are hungry for more follow the next section

## Endpoint
In REST, the resource typically refers to some object or set of objects that are exposed at an API endpoint, like `/users`. The same meaning applies to Wassy `Endpoint` class. To define an endpoint, you call the `.define(options)` method. 

```javascript
var UserEP = Endpoint.define({
        uri: '/users',
    });
```
The `options` parameter has many attributes you can configure

- **host** is server host, default to `http://locahost`
- **uri** the resource path, defaults to `/`
- **headers** optional header fields, in the form of `{'Header-Field':'value'}`
- **model**  optional placeholder to define variables and methods that will be merged to your response object or objects in case the data returned is an array object.
- **cookies** the resource path, defaults to `/`
- **preRequest** a pre-request callback function that can be used to modify the endpoint instance before the request is sent. Use this to set custom headers, etc.
- **postRequest** an optional object of numeric HTTP codes and functions to be called when the response has the corresponding code.
    For example, the following will alert when the response status is a 404:
    ```javascript 1.8
      postRequest: {
        404: function() {
          alert( "page not found" );
        }
      }
    ```
##### Extending an Endpoint
You can create a sub class from a Endpoint super class using the `.extends(options)` methods. Option take the same parameters as `.define(options)`

```javascript 1.8
var BaseEP = Endpoint({
  host: 'http://api.com/v1'
});

var UsersEP = BaseEP.extends({
  uri: '/users',
});

var SchoolsP = BaseEP.extends({
  uri: '/schools',
  headers: { Accept: 'appliction/json' }
});
```
Both `UsersEP` and `SchoolsEP` endpoints will have their `host` parameter set to `http://api.com/v1`.

Only SchoolsEP will add `Accept: application/json` header to all its request

#### Send Request
After defining an endpoint you its instance to send your request 

```javascript
new UsersEP()
      .post({ name: 'wassy' })
      .then(function (resp){ })
      .catch(function (err){ })
      ;
```
All the known HTTP methods (GET/POST/PUT/DELETE/HEAD) are mapped to functions `get, post, put, delete, head`. There is a `send` function if you need to send a custom method

```javascript
var userEP = new UsersEP()
userEP.send('PING');
```
> Endpoint instances can take an optional object as parameter to set path variables value. See the next section to learn more about **path variables**
  
#### Path variables binding
An endpoint may have dynamic parameters inside the URI `/users/2` or `/users/232/comments/10`
The bound variable is defined using curly braces `{<VARIABLE_NAME>}`

```javascript
var UserCommentsEP = Endpoint.define({
    uri: '/users/{userId}/comments/{comId}',
  });
    
var promise = 
  new UserCommentsEP({
    userId: 43,
    comId: 100,
  }).get();

```
Binding parameters are not always numbers they can be string.

```javascript
var promise = 
	new User({ state: 'active' }).get();

```
#### Response
The request methods returns a promise, promise callbacks `.then()`, `.catch()` and `.finally()` are invoked in the order they are registered. Available Promise methods are:
- **promise.then(function( response ) {});**
    
    The response object as these attributes 
    - **status** HTTP status code. 
    - **headers** response headers.
    - **body** raw response data.
    - **bodyJSON** parsed json object, if the response is a `JSON` string.
    - **request** request object configuration.
    
- **promise.catch(function( jqXHR ) {});**
    
    It receives the [$.ajax jqHRX](http://api.jquery.com/jquery.ajax/) object. 

## Model
A model defines variables and methods that will be merged to your response object or objects in case the data returned is an array object.
```javascript
var SchoolsEP = Endpoint.define({
  uri: '/schools',
  model: {
    year: 2018,
    getName() {
      return this.name;
    },
    getCountry() {
      return 'USA';
    }
  },
});

var school = new SchoolsEP()
  .get()
  .then(function(response) {
    const model = response.model;
    // echo: 2018
    console.log(model.year);
    
    // echo: Progress 
    console.log(model.name);
    
    console.log(model.getName());
    // echo: Progress as well
    
    // echo: Progress 
    console.log(model.getAddress());
  });

```





