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
			delayedStart = false
		}
	){ 
		this.port = port; 
		this.io = require('socket.io')();
        
		this.io.on('connection', socket => { 
			socket.on('__sockt_register_event_listener__', prop => {
				service.on(prop, args => socket.emit(prop, args));
			});
			Object.getOwnPropertyNames(Object.getPrototypeOf(service)).forEach( prop => {
				socket.on(prop, async (args, cb) => { 
					if(typeof service[prop] === 'function')
						return cb(await service[prop](args));
					else {
						if(args !== null)                       
							return cb(await (service[prop] = args));
						else
							return cb(await (service[prop]));
					}});
			});});
        
		if(!delayedStart)
			this.io.listen(this.port);
	}

	/**
     * start the socket.io service (if delayed start)
     */
	start(){
		this.io.listen(this.port);
	}
}

module.exports = SocktService;