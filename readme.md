FortNotes client application
============================

[![Public HTTPS client](https://img.shields.io/badge/public-client-green.svg?style=flat-square)](https://fortnotes.github.io/)
[![Gitter](https://img.shields.io/badge/gitter-join%20chat-blue.svg?style=flat-square)](https://gitter.im/DarkPark/FortNotes)

FortNotes is a highly secure online private information manager based on the AES encryption in the browser.
The current stable version - <https://bitbucket.org/DarkPark/fortnotes>


Recommendation:

Considering the importance of authentication I would recommend the following two block cipher modes for most use cases (except for disk encryption purposes): If the data is authenticated by an asymmetric signature use CBC, otherwise use GCM.


## Deployment ##

Dependencies:

- [NodeJS](http://nodejs.org/)
- [Node Packaged Modules](https://npmjs.org/)
- [MongoDB](http://www.mongodb.org/)

Install command (for Ubuntu): `sudo apt-get install nodejs npm mongodb`.

Download and install the project files: `npm install fortnotes`.

Run the server with `npm start` or `node server/main.js`.
Now the web client is accessible in a web browser <http://localhost:8080/client/>.

## Migration ##


## Development ##

`sudo npm install -g grunt-cli`

`npm install`

`grunt`





fortnotes.com/client/
fortnotes.com/sync/
fortnotes.com/api/

app.fortnotes.com
api.fortnotes.com


### Authentication ###

Two-steps algorithm:

`GET /api/v1/auth/name`
> Where `name` is a sha256 hash value of user name.
> Returns operation status code, random salt string used for password hashing and a client call IP address (on success).

`POST /api/v1/auth/name/pass`
> Where `name` is a sha256 hash value of user name, `pass` is a salted sha256 hash value of user pass.
> Returns SJCL user encryption options and a generated API key for future access.


### Client-side data ###

There are some stored parameters in the browser localStorage:

 Name             | Description
:-----------------|:-----------------------------------------------------------
 config.auth.key  | api key for authentication (base64 encoded 64 bytes string)
 config.auth.name | last authenticated user name
 config.pass.salt | random salt data for user password hashing (set on login)
 config.pass.hash | user password hashed with salt (set on login)
 config.sjcl      | encrypt/decrypt user-specific parameters (set on login)


Events:

wamp:open
wamp:close
crypto:open
crypto:close


The [code style](https://github.com/DarkPark/jscs) used for development.


## License ##

`fortnotes-client` is released under the [GPL-3.0 License](http://opensource.org/licenses/GPL-3.0).
