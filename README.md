<div align="center"><p>

<a href="https://github.com/jhenson29/node-soct/blob/master/LICENSE">
<img src="https://img.shields.io/badge/license-MIT-brightgreen.svg"/></a>

<a href="https://travis-ci.org/jhenson29/node-soct">
<img src="https://travis-ci.org/jhenson29/node-soct.svg?branch=master"/></a>

<a href="https://coveralls.io/github/jhenson29/node-soct?branch=master">
<img src="https://coveralls.io/repos/github/jhenson29/node-soct/badge.svg?branch=master"/></a>

<a href="https://snyk.io/test/github/jhenson29/node-soct?targetFile=package.json">
<img src="https://snyk.io/test/github/jhenson29/node-soct/badge.svg?targetFile=package.json" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/jhenson29/node-soct?targetFile=package.json" style="max-width:100%;"></a>
</p></div>

# Node Soct

Proxy classes over socket.io.

## Version 2.x.x w/ TypeScript!

## Install

```javascript
npm i -s soct
```

## Getting Started

### Class to proxy

```javascript
// foo.js

class Foo {
    constructor() {
        this.state = {
            bar: true,
        };
    }

    get bar() {
        return this.state.bar;
    }
    set bar(val) {
        this.state.bar = val;
    }

    baz(val) {
        return val * 2;
    }
}

module.exports = Foo;
```

### New Foo Service

```javascript
//service.js

const {createSoctServer} = require("soct");
const Foo = require("./foo");

createSoctServer(
    new Foo(), // class to proxy; must be an instance of the class
    5000, // port to proxy on
);
```

### Use Foo Proxy

```javascript
// app.js

const {createSoctClient} = require("soct");
const Foo = require("./foo");

const foo = createSoctClient(
    Foo, // class definition
    5000, // port to proxy on (matches previous service)
);

const run = async () => {
    console.log(await foo.bar); // => true
    foo.bar = false;
    console.log(await foo.bar); // => false
    console.log(await foo.baz(5)); // => 10
};

run();
```
