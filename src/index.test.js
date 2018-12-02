const EventEmitter = require('events');
const { Soct, SoctService } = require('./');

const testPort = 44624;

class Foo extends EventEmitter{
	constructor(){
        super();
		this.state = {
			bar: 123
		};
	}
	get bar(){
		return this.state.bar;
	}
	set bar(val){
        this.emit('update', val);
		this.state.bar = val;
	}

	baz(){
		return 42;
	}
}

class Foo2 extends Foo{
	constructor(){
        super();
		this.state = {
			bar: 456
		};
	}
}

test('it reads properties', async () => {
	const service = new SoctService(new Foo, testPort);
	const foo = new Soct(Foo, testPort);
	expect(await (foo.bar)).toEqual(123);
	service.stop();
});

test('it writes properties', async () => {
	const service = new SoctService(new Foo, testPort);
	const foo = new Soct(Foo, testPort);
    expect(await (foo.bar)).not.toEqual(456);
    await(foo.bar = 456);
	expect(await foo.bar).toEqual(456);
	service.stop();
});

test('it calls methods', async () => {
	const service = new SoctService(new Foo, testPort);
	const foo = new Soct(Foo, testPort);
	expect(await foo.baz()).toEqual(42);
	service.stop();
});

test('it listens to events', async () => {
	const service = new SoctService(new Foo, testPort);
	const foo = new Soct(Foo, testPort);
    let emitVal; 
    foo.on('update', val => emitVal = val);
	foo.bar = 789;
	await foo.bar;
	expect(emitVal).toEqual(789);
	service.stop();
});

test('it uses host option', async () => {
	const service = new SoctService(new Foo, testPort);

	const foo1 = new Soct(Foo, testPort);
	expect((await foo1.bar)).toEqual(123);

	const foo2 = new Soct(Foo, testPort, {});
	expect((await foo2.bar)).toEqual(123);

	const foo3 = new Soct(Foo, testPort, { host: 'http://localhost'});
	expect((await foo3.bar)).toEqual(123);

	const foo4 = new Soct(Foo, testPort, { host: 'http://127.0.0.1'});
	expect((await foo4.bar)).toEqual(123);

	service.stop();
});

test('it delays start and restarts', async () => {
	const service1 = new SoctService(new Foo, testPort, {});
	const service2 = new SoctService(new Foo2, testPort, { delayedStart: true });

	const foo1 = new Soct(Foo, testPort);
	expect((await foo1.bar)).toEqual(123);

	/*
	service1.stop();
	service2.start();
	const foo2 = new Soct(Foo, testPort);
	expect((await foo2.bar)).toEqual(456);

	service2.stop();
	service1.start();
	const foo3 = new Soct(Foo, testPort);
	expect((await foo3.bar)).toEqual(123);
	*/

	service1.stop();
});

/*
test('disconnects with and without listeners', async () => {
	const service = new SoctService(new Foo, testPort);

	function withListeners(){
		const foo = new Soct(Foo, testPort);
		foo.on('update', () => {});
		return null;
	}

	function withOutListeners(){
		new Soct(Foo, testPort);
		return null;
	}

	expect(withListeners()).toEqual(null);
	expect(withOutListeners()).toEqual(null);

	service.stop();
});
*/