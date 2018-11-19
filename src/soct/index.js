const socket = Symbol('socket');

/**
 * Sockt service client wrapper
 */
class Soct{
	/**
     * 
     * @param {object function} service // class or function to wrap
     * @param {number} port // port number for service
     * @param {string} host // host connection string for service
     */
	constructor(
		service,
		port,
		host = 'http://localhost',
	){ 
		this[socket] = require('socket.io-client')(`${host}:${port}`);
		const testObj = new service();
		Object.getOwnPropertyNames(service.prototype).forEach( prop => {
            
			if (typeof testObj[prop] === 'function')
				this[prop] = args => new Promise( resolve => this[socket].emit(prop, args, cb => resolve(cb)));
			else {
				Object.defineProperty(
					this, 
					prop, 
					{
						get: () => new Promise( resolve => this[socket].emit(prop, null, cb => resolve(cb))),
						set: (args) => new Promise( resolve => this[socket].emit(prop, args, cb => resolve(cb)))
					}
				);
			}
		});
	}

	/**
     * add an event listener
     * @param {string} name 
     * @param {function} func 
     */
	on(name, func){
		this[socket].emit('__sockt_register_event_listener__',name);
		this[socket].on(name, args => func(args));
	}
}

module.exports = Soct;