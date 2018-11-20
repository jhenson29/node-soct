const OPTIONDEFAULT = {
	delayedStart: false
};

/**
 * socket-io service wrapper
 */
class SocktService{
	/**
     * 
     * @param {object, function} service // class instance or function to listen for
     * @param {number} port // enter the port number to listen on
     * @param {object} options // options for service | delayedStart
     */
	constructor(
		service,
		port,
		{
			delayedStart = OPTIONDEFAULT.delayedStart
		} = OPTIONDEFAULT
	){ 
		this.state = {
			port,
			io: require('socket.io')(),
		};

		this.state.io.on('connection', socket => { 
			socket.on('__sockt_register_event_listener__', prop => {
				service.on(prop, (...args) => socket.emit(prop, [...args]));
			});
			Object.getOwnPropertyNames(Object.getPrototypeOf(service)).forEach( prop => {
				socket.on(prop, async (args, cb) => { 
					// map methods and properties
					return typeof service[prop] === 'function' ? cb(await service[prop](...args)) : args === null ? cb(await (service[prop])) : cb(await (service[prop] = args));
				});
			});});
        
		if(!delayedStart)
			this.start();
	}

	/**
     * start the socket.io service (if delayed start)
	 * @public
     */
	start(){
		const { io, port } = this.state;
		io.listen(port);
	}
}

module.exports = SocktService;