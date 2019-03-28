const moment = require('moment');

module.exports = function(app, req, res, params) {
    app.models.room.findOne({_id: params[0]}).populate('players.p1 players.p2 log.player chat.player').exec(function(err, room) {
        
        const player1 = null;
        const player2 = null;
        const playerIdx = 1;
        if (req.session.meFB.id == room.players.p1.facebookId) {
            player1 = room.players.p1;
            player2 = room.players.p2;
        } else if (req.session.meFB.id == room.players.p2.facebookId) {
            player1 = room.players.p2;
            player2 = room.players.p1;
            playerIdx = 2;
        }

        if (player1) {
            const data = {
                roomId: params[0],
                room: room,
                moment: moment,
                playerIdx: playerIdx,
                player1: player1,
                player2: player2,
                players: {}
            };
            data.players[player1._id] = player1;
            data.players[player2._id] = player2;
            
            res.render('game', data);
        }
    
    });
};