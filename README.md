# express-sequelize-sqlite-secure-login-boilerplate

## SQLite

Note: SQLite is not appropriate for sites that require concurrency (multiple users writing to the DB at once). So be careful if you are considering using SQLite in production. However, SQLite does support an unlimited number of simulatenous readers.

[http://www.sqlite.org/whentouse.html](http://www.sqlite.org/whentouse.html)

[https://www.sqlite.org/quickstart.html](https://www.sqlite.org/quickstart.html)

```bash
$ mkdir db
$ cd db
$ sqlite3 db_name.db
```

Then type `CTRL+D` to quit the sqlite3 shell. The database has been created in the `db/` directory.

### sqlite3 shell

run `$ sqlite3 db_name.db` to re-enter the shell to manage the database

[https://www.sitepoint.com/getting-started-sqlite3-basic-commands/](https://www.sitepoint.com/getting-started-sqlite3-basic-commands/)

[https://www.tutorialspoint.com/sqlite/](https://www.tutorialspoint.com/sqlite/)

## style guide

[https://github.com/airbnb/javascript](https://github.com/airbnb/javascript)

## getting started

1. clone the repo

2. use text editor with ESLint installed

3. create self signed certificate for SSL/ TLS

4. execute the following bash commands:

```bash
$ cd app
$ npm i
$ npm run build
$ sudo npm start
```

## boilerplate tasks completed

```bash
$ express --view=ejs --git app
$ cd app
$ npm i --save sequelize express-ejs-layouts dotenv
$ npm i --save-dev nodemon eslint eslint-plugin-import
$ npm i --save-dev eslint-config-airbnb-base
$ sequelize init
$ mkdir routes/api
$ mkdir views/partials
$ touch views/layout.ejs
$ touch public/javascripts/main.js
$ touch .env .env.example
$ touch .eslintrc
$ echo '{
  "extends": "airbnb-base"
}' >> .eslintrc
```

additional packages installed are shown in `/package.json`


## developer notes

### to set up view engine:

```js
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
```

### ESLint instructions

download ESLint, SublimeLinter, SublimeLinter-ESLint, and run `$ eslint --init` to setup eslint

https://github.com/SublimeLinter/SublimeLinter-eslint

### generating self-signed certificate

SSL/ TLS - Secure Sockets Layer, the latest version is called Transport Layer Security

generate a private key called server.key ad a certificate called cert.pem in desired directory

```bash
$ cd /usr/local/directory/
$ openssl req -x509 -sha256 -nodes -newkey rsa:2048 -keyout server.key -out cert.pem -days 90
```

add the following to `/bin/www` or `/app.js` depending on setup

```js
var options = {
  key: fs.readFileSync('/usr/local/directory/server.key'),
  cert: fs.readFileSync('/usr/local/directory/cert.pem')
}

https.createServer(options, app).listen(port, (err) => {
  if (err) console.log('error', error)
})
```

### to set up flash messages (`express-session` needed for `connect-flash` to work):

1.

```js
const session = require('express-session');
const flash = require('connect-flash');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUnitialized: true,
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash();
  next();
});
```

2. create `views/partials/alerts.ejs`

### to generate random strings:

[http://osxdaily.com/2011/05/10/generate-random-passwords-command-line/](http://osxdaily.com/2011/05/10/generate-random-passwords-command-line/)

### express-session

[https://www.npmjs.com/package/express-session](https://www.npmjs.com/package/express-session)

`cookie-parser` middleware is no longer required for `express-session`

`2018-02-10T00:24:04.904Z` is an example of ISO 8601 datetime representation

`T00:24:04.904Z` means **T**ime hh:mm:ss.sss **Z**ero UTC offset

### passport.session()

[https://stackoverflow.com/questions/22052258/what-does-passport-session-middleware-do](https://stackoverflow.com/questions/22052258/what-does-passport-session-middleware-do)

[http://www.passportjs.org/docs/configure/#sessions](http://www.passportjs.org/docs/configure/#sessions)

this middleware is used in addition to `express-session`, it is not used on its own

In this app, only the user ID is serialized to the session, keeping the amount of data stored within the session small. When subsequent requests are received, this ID is used to find the user, which will be restored to req.user.

### bcrypt

the prefix `$2a$10$` in the shadow password record of a bcrypt hashed password means:

`$2a$` indicates that hash string is a bcrypt hash in modular crypt format

`$10$` indicates a cost parameter of 10, meaning 2^10 rounds of hashing occurred
