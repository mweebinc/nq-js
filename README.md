# NQ JS

> nq-js is a library for nq-api to use rest API in javascript almost all functionality used Promise

## Technologies Used

- XMLHttpRequest - version latest
- ws - version 8.8.0

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

save object

```
Queue.Document.create(collection, object);
```

get object

```
Queue.Document.get(collection, id);
```

find object

```
Queue.Document.find(collection, query);
```

update object

```
Queue.Document.update(collection, object);
```

delete object

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

where is an object specify the key and value of the object for example if you want to find users with firstName equal to
john

```
const query = {where:{firstName:'john'}}
```

you can use wildcard query by specifying regex to the value for example if you want to find users with the starting
firstName equal to Jo

```
const query = {where:{firstName:{$regex:'Jo',$options:'i'}}}
```

$options:i means ignore case

### where or

if you want to find objects with or operation for example if you want to find users with fistName equal to john or
lastName equal to doe the syntax is $or with array of queries

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
