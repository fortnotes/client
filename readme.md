FortNotes web application
=========================

[![SSL Rating](https://sslbadge.org/?domain=fortnotes.github.io)](https://www.ssllabs.com/ssltest/analyze.html?d=fortnotes.github.io)
[![Public HTTPS client](https://img.shields.io/badge/public-client-green.svg?style=flat-square)](https://fortnotes.github.io/)
[![Gitter](https://img.shields.io/badge/gitter-join%20chat-blue.svg?style=flat-square)](https://gitter.im/DarkPark/FortNotes)

FortNotes is a secure private information storage based on the symmetric and asymmetric encryption in the browser.

The latest stable version is always available on the official web site [app.fortnotes.com](https://app.fortnotes.com/).


## Development ##

Create a new project base:

```bash
git clone https://github.com/fortnotes/client.git
```

Install dependencies:

```bash
cd client
npm install
```

Some npm scripts available:

```bash
# init build structure
npm run develop init

# build everything
npm run develop build

# monitor all file changes and rebuild
npm run develop watch

# start static, livereload and repl services
npm run develop serve

# start only one service
npm run develop repl:start

# show all task with statuses
npm run develop status

# show task configuration
npm run develop pug:config

# and so on
```

The same commands are possible for the release profile.


## Contribution ##

If you have any problems or suggestions please open an [issue](https://github.com/fortnotes/client/issues)
according to the contribution [rules](.github/contributing.md).


## License ##

`fortnotes-client` is released under the [GPL-3.0 License](http://opensource.org/licenses/GPL-3.0).
