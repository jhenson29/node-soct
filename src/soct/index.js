const _socket = Symbol('socket');
const _emit = Symbol('emit');

const OPTIONDEFAULT = {
	host: 'http://localhost',
	async: false,
};

/**
 * Soct proxy class
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
		{
			host = OPTIONDEFAULT.host,
			async = OPTIONDEFAULT.async,
		} = OPTIONDEFAULT
	){ 
		this[_socket] = require('socket.io-client')(`${host}:${port}`);
		const testObj = new service();
		Object.getOwnPropertyNames(service.prototype).forEach( prop => {
			
			// map a method
			if (typeof testObj[prop] === 'function')
				this[prop] = async (...args) => async ? this[_emit](prop,[...args]) : await this[_emit](prop,[...args]);

			// map a property
			else {
				Object.defineProperty(
					this, 
					prop, 
					{
						get: async () => async ? this[_emit](prop) : await this[_emit](prop),
						set: async args => async ? this[_emit](prop,args) : await this[_emit](prop, args)
					}
				);
			}
		});
	}

	/**
     * add an event listener
	 * @public
     * @param {string} name 
     * @param {function} func 
     */
	on(name, func){
		this[_socket].emit('__sockt_register_event_listener__',name);
		this[_socket].on(name, args => func(args));
	}

	/**
	 * emit map
	 * @private
	 * @param {string} prop 
	 * @param {any} args 
	 */
	[_emit](
		prop,
		args
	){
		return new Promise( resolve => this[_socket].emit(prop, args, cb => resolve(cb)));
	}
}

module.exports = Soct;