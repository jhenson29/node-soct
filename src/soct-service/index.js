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
			io: require('socket.io')()
		};

		const listeners = {};
		const functions = {};

		this.state.io.on('connection', socket => { 
			const { id } = socket;
			listeners[id] = [];
			functions[id] = [];
			socket.emit('__soct_new_connection__');
			socket.on('__soct_register_event_listener__', ({ name, uuid }) => {
				if(!listeners[socket.id].includes(uuid)){
					const func = args => socket.emit(name, args);
					listeners[id].push(uuid);
					functions[id].push({
						name,
						func
					});
					service.on(name, func);
				}
			});

			socket.on('disconnect', () =>{
				if(listeners[id]){
					functions[id].forEach( listener => service.removeListener(listener.name, listener.func));
					delete listeners[id];
					delete functions[id];
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
     * start the socket.io service (if delayed start or stopped)
	 * @public
     */
	start(){
		const { io, port } = this.state;
		io.listen(port);
	}

	/**
	 * stop the socket.io service
	 * @public
	 */
	stop(){
		const { io } = this.state;
		io.close();
	}
}

module.exports = SocktService;