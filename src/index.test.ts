import {EventEmitter} from "events";
import {createSoctClient, createSoctServer} from "./";

const testPort = 44624;

class Foo extends EventEmitter {
    private _state: {bar: number};
    constructor() {
        super();
        this._state = {
            bar: 123,
        };
    }
    get bar() {
        return this._state.bar;
    }
    set bar(val) {
        this.emit("update", val);
        this._state.bar = val;
    }

    baz() {
        return 42;
    }
}

test("it reads properties", async () => {
    const service = createSoctServer(new Foo(), testPort);
    const foo = createSoctClient<Foo>(Foo, testPort);
    expect(await foo.bar).toEqual(123);
    service.stop();
});

test("it writes properties", async () => {
    const service = createSoctServer(new Foo(), testPort);
    const foo = createSoctClient<Foo>(Foo, testPort);
    expect(await foo.bar).not.toEqual(456);
    await (foo.bar = 456);
    expect(await foo.bar).toEqual(456);
    service.stop();
});

test("it calls methods", async () => {
    const service = createSoctServer(new Foo(), testPort);
    const foo = createSoctClient<Foo>(Foo, testPort);
    expect(await foo.baz()).toEqual(42);
    service.stop();
});

test("it listens to events", async () => {
    const service = createSoctServer(new Foo(), testPort);
    const foo = createSoctClient<Foo>(Foo, testPort);
    let emitVal;
    foo.on("update", val => (emitVal = val));
    foo.bar = 789;
    await foo.bar;
    expect(emitVal).toEqual(789);
    service.stop();
});

test("it uses host option", async () => {
    const service = createSoctServer(new Foo(), testPort);

    const foo1 = createSoctClient<Foo>(Foo, testPort);
    expect(await foo1.bar).toEqual(123);

    const foo2 = createSoctClient<Foo>(Foo, testPort, {});
    expect(await foo2.bar).toEqual(123);

    const foo3 = createSoctClient<Foo>(Foo, testPort, {host: "http://localhost"});
    expect(await foo3.bar).toEqual(123);

    const foo4 = createSoctClient<Foo>(Foo, testPort, {host: "http://127.0.0.1"});
    expect(await foo4.bar).toEqual(123);

    service.stop();
});
