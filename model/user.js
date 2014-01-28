var app = module.parent.exports.app;
var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    facebookId: Number,
    name: String,
    picture: String,
    wins: { type: Number, default: 0 },
    loses: { type: Number, default: 0 },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

schema.statics.countAllUsers = function(cb) {
    return this.model('user')
            .count(function(err, count) {
                cb(count);
            });
};

schema.methods.countActiveGames = function(cb) {
    return this.model('room')
            .count({winner: null, $or: [{'players.p1': this._id}, {'players.p2': this._id}]}, function(err, count) {
                cb(count);
            });
};

schema.methods.getActiveGames = function(cb) {
    return this.model('room')
    		.find({endDate: null, $or: [{'players.p1': this._id}, {'players.p2': this._id}]})
    		.populate('players.p1 players.p2')
    		.exec(function(err, games) {
		    	cb(games);
		    });
};

schema.methods.getWins = function(cb) {
    return this.model('room')
    		.find({endDate: {$ne: null}, $or: [{'players.p1': this._id, winner: 1}, {'players.p2': this._id, winner:2}]})
    		.populate('players.p1 players.p2')
    		.exec(function(err, wins) {
		    	cb(wins);
		    });
};

schema.methods.getLoses = function(cb) {
    return this.model('room')
    		.find({endDate: {$ne: null}, $or: [{'players.p1': this._id, winner: 2}, {'players.p2': this._id, winner:1}]})
    		.populate('players.p1 players.p2')
    		.exec(function(err, loses) {
		    	cb(loses);
		    });
};

schema.methods.getWinsAndLoses = function(cb) {
	var self = this;
	self.getWins(function(wins) {
		self.getLoses(function(loses) {
			cb(wins, loses);
		});
	});
};


schema.pre('save', function(next) {
    this.updated = new Date();
    next();
});

module.exports = mongoose.model('user', schema);