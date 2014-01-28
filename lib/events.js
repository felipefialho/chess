var app = module.parent.exports;
var events = require("events")
    , util = require("util");

// Emitter Class - Responsible for all the events on the game
function Emitter() {
    events.EventEmitter.call(this);
}

util.inherits(Emitter, events.EventEmitter);

Emitter.prototype.connect = function() {
	this.emit('connect', {});
};


// Events
app.emitter = new Emitter();

app.emitter.on('connect', function() {
	
});

module.exports = app.emitter;