DataBase structure
==================


## Table: users ##

Structure:

```js
var user = {
    id: 1,
    nodeId: 1,
    name: 'John',
    crypto: {
        //    
    }
}
```


## Table: nodes ##

Structure:

```js
var node = {
    id: 1,
    userId: 1,
    data: {iv: '...', em: '...'}
}
```

Decrypted data:

```js
var node = {
    id: 1,
    userId: 1,
    data: {
        name: 'home laptop',
        keys: {
            public: 'mX9V2uKxj2ZKVQa6rC98mws3owjAgYm7m76jRsXCX3u//6NdDg',
            private: 'PAwKik5txqxzlPKHl3M6dqsTL/GgMVG0EzTBRg0sV4jOxJi+hJhSpda...'
        },
        ctime: 1508145833830  // creation time
    }
}
```


## Table: notes ##

Structure:

```js
var note = {
    id: 1,
    userId: 1,
    data: {iv: '...', em: '...'}
}
```

/////////////////////////////////////

separate db for each user profile
db name - sha256(userName)
localStorage.set('users', ['John', 'Bill'])
localStorage.set('db', '6g6543x54c87ny9imk76')

options
    time
    name
    value

keys

data

notes
