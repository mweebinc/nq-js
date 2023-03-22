# NQ JS

nq-js is a client side Javascript library of nq-api. nq-api has two protocol are used the HTTP and the Socket protocol.
We use HTTP for saving and getting the data and Socket for realtime data like chat applications.

## Concept

nq-api used a JSON format to send and receive the data.

## Usage

to use this module you need to import first

```
import Queue from 'nq';
// set url
Queue.setUrl('https://api.innque.com/v1');
// set application ID
Queue.setApplicationId('6560588f36297abd70cb7433774d5e09');
```

inside the Queue object there's multiple sub object

* Schema - a utility to change the Schema of Collections
* Object - a utility to execute CRUD operation
* File - a utility to upload or download a file
* User - it has functionality to manage current user

## Object

#### save object

```
Queue.Document.create(collection, object);
```

#### get object

```
Queue.Document.get(collection, id);
```

#### find object

```
Queue.Document.find(collection, query);
```

#### update object

```
Queue.Document.update(collection, object);
```

#### delete object

```
Queue.Document.delete(collection, id);
```

## Query

a query is an object with multiple options

* where - where you can find specific objects
* count - return count of objects you can read
* limit - limit the result objects
* skip - skip the result
* include - include the pointer or relations data
* sort - sort the object

### where

where is an object specify the exact match of the key and the value of the object.\
{key:value}

for example if you want to find users with firstName equal to john

```
const query = {where:{firstName:'john'}}
```

besides, exact matching where support other type of comparisons.\
{key:{$operation:value}}

Operation &nbsp; &nbsp; &nbsp; Meaning

* $regex - Requires that a key’s value match a regular expression
* $lt - Less Than
* $lte - Less Than Or Equal To
* $gt - Greater Than
* $gte - Greater Than Or Equal To
* $ne - Not Equal To
* $in - Contained In
* $nin - Not Contained in
* $exists - A value is set for the key
* $select - This matches a value for a key in the result of a different query
* $dontSelect - Requires that a key’s value not match a value for a key in the result of a different query
* $all - Contains all of the given values
* $text - Performs a full text search on indexed fields

#### $regex

a common use of regex is a query of wildcard value.

for example if you want to find users with the starting firstName equal to Jo

```
const query = {where:{firstName:{$regex:'Jo',$options:'i'}}}
```

$options:i means ignore case

### where or

if you want to find objects with match one of several queries.

example if you want to find users with fistName equal to john or lastName equal to doe.

```
const query = {where:$or:[{firstName:'john'},{lastName:'doe'}]}
```

you can combine or with regex operation

```
const query = {where:$or:[{firstName:{$regex:'jo'}},{lastName:{$regex:'doe'}}]}
```

### count

```
const query = {count:true}
```

by default the result of find is an array of objects but if you enable count the result is

```
{
 count:0,
 objects:[]
}
```

### limit

let say you have 200 users and you want to get only the first 10

```
const query = {limit:10}
```

### skip

limit and skip are often used for pagination let say you have 20 users and you want to read start from 10 to 20 you can
use skip

```
const query = {skip:10}
```

### include

if you have data type Pointer or Relation and you want to include the data of the pointer the value of include is array
of keys of the Pointer or Relation or you can use all value to include all Pointer and Relation values

```
const query = {include:['all']}
```

you can include a sub object by specifying a dot notation, let say you have address object with user object and you want
the address is Pointer to Shipping and you want to get the user information

```
const query = {include:['address.user']}
```

### sort

if you want to sort the objects by its key, by default the query is sort ascending then if you want to sort descending

```
const query = {createdAt: -1}
```

## User

user object has functionality to interact current user signup user

#### sign-up user

```
const user = {email:'john@gmail.com',password:'pass123$'};
Queue.User.signup(user);
```

#### sign-in user

```
const user = {email:'john@gmail.com',password:'pass123$'};
Queue.User.signin(user);
```

#### get current user

```
Queue.User.getCurrentUser();
```

#### sign-out user

```
Queue.User.signOut();
```

#### reset password of the user

```
const email = 'john@gmail.com';
Queue.User.resetPassword(email);
```

## File

file use native blob to save a file

#### save file

```
Queue.File.save(blob);
```

## LiveQuery

Using the LiveQuery Module you can subscribe in a specific query when collection has changed. To use a LiveQuery
features We call Live Query for WebSocket Protocol subscribe

```javascript
// your query you interested in.
const query = {
    collection: 'messages',
    where: {}
}
// subscribe to the Event
const subscription = Queue.LiveQuery.subscribe(query);
// Open the connection
Queue.LiveQuery.open();
// when new object has been created then your query is match 
// this even are triggered
subscription.on('create', message => {

});
```

The installationId field is optional. InstallationId is a identifier for a device. It can be used for monitoring.

## Installation

first clone this package

```
git clone https://github.com/innqueinc/nq-js.git
```

then goto the folder

```
cd nq-js
```

link the project to your global dependency

```
npm link
```

install to your project

```
npm link nq
```
