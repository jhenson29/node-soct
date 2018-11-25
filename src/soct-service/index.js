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
			listeners: {},
		};

		const { listeners } = this.state;
		this.state.io.on('connection', socket => { 
			listeners[socket.id] = [];
			socket.emit('__soct_new_connection__');
			socket.on('__soct_register_event_listener__', ({ name, id }) => {
				if(!listeners[socket.id].includes(id)){
					listeners[socket.id].push(id);
					service.on(name, (...args) => socket.emit(name, [...args]));
				}
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