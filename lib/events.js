let app = module.parent.exports;
const events = require("events")
    , util = require("util");

// Emitter Class - Responsible for all the events on the game
function Emitter() {
    events.EventEmitter.call(this);
}

util.inherits(Emitter, events.EventEmitter);

Emitter.prototype.connect = () => {
	this.emit('connect', {});
};


// Events
app.emitter = new Emitter();

app.emitter.on('connect', () => {
	
});

module.exports = app.emitter;