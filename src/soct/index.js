const uuid = require('uuid/v4');

const _state = Symbol('state');
const _mapClass = Symbol('mapClass');
const _registerListenOnConnection = Symbol('registerListenOnConnection');
const _emit = Symbol('emit');
const _registerListener = Symbol('registerListener');

const OPTIONDEFAULT = {
	host: 'http://localhost',
};

/**
 * Soct proxy class
 */
class Soct{
	/**
     * 
     * @param {object} service // class to wrap
     * @param {number} port // port number for service
     * @param {object} options // options
     */
	constructor(
		service,
		port,
		{
			host = OPTIONDEFAULT.host,
		} = OPTIONDEFAULT
	){ 
		this[_state] = {
			socket:  require('socket.io-client')(`${host}:${port}`),
			eventListeners: []
		};

		this[_mapClass](service);
		this[_registerListenOnConnection]();
	}

	/**
     * add an event listener
	 * @public
     * @param {string} name 
     * @param {function} func 
     */
	on(name, func){
		const { socket, eventListeners } = this[_state];
		const listener = {
			name,
			id: uuid()
		};
		eventListeners.push(listener);
		this[_registerListener](listener);
		socket.on(name, args => func(args));
	}

	/**
	 * map the class to this instance of soct
	 * @param {object} service 
	 */
	[_mapClass](
		service
	){
		const testObj = new service();
		Object.getOwnPropertyNames(service.prototype).forEach( prop => {
			
			// map a method
			if (typeof testObj[prop] === 'function')
				this[prop] = async (...args) => this[_emit](prop,[...args]);

			// map a property
			else {
				Object.defineProperty(
					this, 
					prop, 
					{
						get: () => this[_emit](prop),
						set: args => this[_emit](prop,args)
					}
				);
			}
		});
	}

	/**
	 * register 'listen on connection'
	 */
	[_registerListenOnConnection](){
		const { socket } = this[_state];
		socket.on('__soct_new_connection__', () => {
			this[_state].eventListeners.forEach( listener => this[_registerListener](listener));
		});
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
		const { socket } = this[_state];
		return new Promise( resolve => socket.emit(prop, args, cb => resolve(cb)));
	}

	/**
	 * register listener with socket
	 * @param {string} name 
	 */
	[_registerListener](
		listener
	){
		const { socket } = this[_state];
		socket.emit('__soct_register_event_listener__', listener);
	}
}

module.exports = Soct;