import {SoctClient} from ".";

class foo {
    private _state: {bar: true};

    constructor() {
        this._state = {
            bar: true,
        };
    }
    get bar() {
        return this._state.bar;
    }
    set bar(val) {
        this._state.bar = val;
    }

    baz() {
        return 42;
    }
}

test("it maps property to soct", () => {
    const soct = new SoctClient(foo, 0);
    expect(soct).toHaveProperty("bar");
});

test("it maps method to soct", () => {
    const soct = new SoctClient(foo, 0);
    expect(soct).toHaveProperty("baz");
});

test("it maps a property as property", () => {
    const soct = new SoctClient(foo, 0);
    expect(typeof soct.bar).toEqual("object");
});

test("it maps a method as method", () => {
    const soct = new SoctClient(foo, 0);
    expect(typeof soct.baz).toEqual("function");
});
