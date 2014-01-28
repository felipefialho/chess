var app = module.parent.exports.app;
var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    winner: { type: Number, default: null },
    endDate: { type: Date, default: null },
    players: {
        p1: {type: mongoose.Schema.Types.Mixed, ref: 'user'},
        p2: {type: mongoose.Schema.Types.Mixed, ref: 'user'}
    },
    requestId: Number,
    turn: {type: Number, default: 1},
    log: [{
        player: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        date: Date,
        action: String,
        data: mongoose.Schema.Types.Mixed
    }],
    chat:[{
        player: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        message: String,
        date: Date
    }],
    sides: {
        p1: { type: Number, default: 1 },
        p2: { type: Number, default: -1 }
    },
    board: {
        type: mongoose.Schema.Types.Mixed,
        default: {
            a: {
                1: { player: 1, piece: 'rook', moviments: 0 },
                2: { player: 1, piece: 'horse', moviments: 0 },
                3: { player: 1, piece: 'bishop', moviments: 0 },
                4: { player: 1, piece: 'queen', moviments: 0 },
                5: { player: 1, piece: 'king', moviments: 0 },
                6: { player: 1, piece: 'bishop', moviments: 0 },
                7: { player: 1, piece: 'horse', moviments: 0 },
                8: { player: 1, piece: 'rook', moviments: 0 }
            },
            b: {
                1: { player: 1, piece: 'pawn', moviments: 0, passant: 0 },
                2: { player: 1, piece: 'pawn', moviments: 0, passant: 0 },
                3: { player: 1, piece: 'pawn', moviments: 0, passant: 0 },
                4: { player: 1, piece: 'pawn', moviments: 0, passant: 0 },
                5: { player: 1, piece: 'pawn', moviments: 0, passant: 0 },
                6: { player: 1, piece: 'pawn', moviments: 0, passant: 0 },
                7: { player: 1, piece: 'pawn', moviments: 0, passant: 0 },
                8: { player: 1, piece: 'pawn', moviments: 0, passant: 0 }
            },
            c: {
                2: { player: null, piece: null, moviments: 0 },
                1: { player: null, piece: null, moviments: 0 },
                3: { player: null, piece: null, moviments: 0 },
                4: { player: null, piece: null, moviments: 0 },
                5: { player: null, piece: null, moviments: 0 },
                6: { player: null, piece: null, moviments: 0 },
                7: { player: null, piece: null, moviments: 0 },
                8: { player: null, piece: null, moviments: 0 }
            },
            d: {
                1: { player: null, piece: null, moviments: 0 },
                2: { player: null, piece: null, moviments: 0 },
                3: { player: null, piece: null, moviments: 0 },
                4: { player: null, piece: null, moviments: 0 },
                5: { player: null, piece: null, moviments: 0 },
                6: { player: null, piece: null, moviments: 0 },
                7: { player: null, piece: null, moviments: 0 },
                8: { player: null, piece: null, moviments: 0 }
            },
            e: {
                1: { player: null, piece: null, moviments: 0 },
                2: { player: null, piece: null, moviments: 0 },
                3: { player: null, piece: null, moviments: 0 },
                4: { player: null, piece: null, moviments: 0 },
                5: { player: null, piece: null, moviments: 0 },
                6: { player: null, piece: null, moviments: 0 },
                7: { player: null, piece: null, moviments: 0 },
                8: { player: null, piece: null, moviments: 0 }
            },
            f: {
                1: { player: null, piece: null, moviments: 0 },
                2: { player: null, piece: null, moviments: 0 },
                3: { player: null, piece: null, moviments: 0 },
                4: { player: null, piece: null, moviments: 0 },
                5: { player: null, piece: null, moviments: 0 },
                6: { player: null, piece: null, moviments: 0 },
                7: { player: null, piece: null, moviments: 0 },
                8: { player: null, piece: null, moviments: 0 }
            },
            g: {
                1: { player: 2, piece: 'pawn', moviments: 0, passant: 0 },
                2: { player: 2, piece: 'pawn', moviments: 0, passant: 0 },
                3: { player: 2, piece: 'pawn', moviments: 0, passant: 0 },
                4: { player: 2, piece: 'pawn', moviments: 0, passant: 0 },
                5: { player: 2, piece: 'pawn', moviments: 0, passant: 0 },
                6: { player: 2, piece: 'pawn', moviments: 0, passant: 0 },
                7: { player: 2, piece: 'pawn', moviments: 0, passant: 0 },
                8: { player: 2, piece: 'pawn', moviments: 0, passant: 0 }
            },
            h: {
                1: { player: 2, piece: 'rook', moviments: 0 },
                2: { player: 2, piece: 'horse', moviments: 0 },
                3: { player: 2, piece: 'bishop', moviments: 0 },
                4: { player: 2, piece: 'queen', moviments: 0 },
                5: { player: 2, piece: 'king', moviments: 0 },
                6: { player: 2, piece: 'bishop', moviments: 0 },
                7: { player: 2, piece: 'horse', moviments: 0 },
                8: { player: 2, piece: 'rook', moviments: 0 }
            }
        }
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

schema.statics.countActiveGames = function(cb) {
    return this.model('room')
            .count({endDate: null}, function(err, count) {
                cb(count);
            });
};

schema.statics.countAllGames = function(cb) {
    return this.model('room')
            .count(function(err, count) {
                cb(count);
            });
};

schema.pre('save', function(next) {
    this.updated = new Date();
    next();
});

module.exports = mongoose.model('room', schema);