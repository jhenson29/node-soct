const Soct = require('./');

class foo{
	constructor(){
		this.state = {
			bar: true
		};
	}
	get bar(){
		return this.state.bar;
	}
	set bar(val){
		this.state.bar = val;
	}

	baz(){
		return 42;
	}
}

test('it maps property to soct', () => {
	const soct = new Soct(foo, 0);
	expect(soct).toHaveProperty('bar');
});

test('it maps method to soct', () => {
	const soct = new Soct(foo, 0);
	expect(soct).toHaveProperty('baz');
});

test('it maps a property as property', () => {
	const soct = new Soct(foo, 0);
	expect(typeof soct.bar).toEqual('object');
});

test('it maps a method as method', () => {
	const soct = new Soct(foo, 0);
	expect(typeof soct.baz).toEqual('function');
});