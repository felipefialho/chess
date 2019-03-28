let app = module.parent.exports.app;
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    facebookId: Number,
    name: String,
    picture: String,
    wins: { type: Number, default: 0 },
    loses: { type: Number, default: 0 },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

schema.statics.countAllUsers = (cb) => {
    return this.model('user')
            .count((err, count) => {
                cb(count);
            });
};

schema.methods.countActiveGames = (cb) => {
    return this.model('room')
            .count({winner: null, $or: [{'players.p1': this._id}, {'players.p2': this._id}]}, (err, count) =>{
                cb(count);
            });
};

schema.methods.getActiveGames = (cb) => {
    return this.model('room')
    		.find({endDate: null, $or: [{'players.p1': this._id}, {'players.p2': this._id}]})
    		.populate('players.p1 players.p2')
    		.exec((err, games) => {
		    	cb(games);
		    });
};

schema.methods.getWins = (cb) => {
    return this.model('room')
    		.find({endDate: {$ne: null}, $or: [{'players.p1': this._id, winner: 1}, {'players.p2': this._id, winner:2}]})
    		.populate('players.p1 players.p2')
    		.exec((err, wins) => {
		    	cb(wins);
		    });
};

schema.methods.getLoses = (cb) => {
    return this.model('room')
    		.find({endDate: {$ne: null}, $or: [{'players.p1': this._id, winner: 2}, {'players.p2': this._id, winner:1}]})
    		.populate('players.p1 players.p2')
    		.exec((err, loses) => {
		    	cb(loses);
		    });
};

schema.methods.getWinsAndLoses = (cb) => {
	const self = this;
	self.getWins((wins)=> {
		self.getLoses((loses) => {
			cb(wins, loses);
		});
	});
};


schema.pre('save', (next) => {
    this.updated = new Date();
    next();
});

module.exports = mongoose.model('user', schema);