// var app = module.parent.app;

module.exports = function(app, req, res, params) {
    app.checkUser(params[1], function(dbUser2) {

        req.session.me.countActiveGames(function(gamesp1) {

            dbUser2.countActiveGames(function(gamesp2) {

                if ((gamesp1 < 10) || (gamesp2 < 10)) {
                    const room = new app.models.room({
                        requestId: params[0],
                        players: {
                            p1: req.session.me._id,
                            p2: dbUser2._id
                        }
                    });

                    room.save();
                    res.redirect('/chess/game/'+room._id);
                }  else {
                    res.redirect('/chess/home');
                }
                

            });

        });

    });
};


