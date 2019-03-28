const moment = require('moment');

module.exports = function(app, req, res) {
    app.checkUser(req.session.meFB.id, function(dbUser) {
        
        req.session.me.getActiveGames(function(rooms) {
            
            req.session.me.getWinsAndLoses(function(wins ,loses) {
                
                const getWinsLosesIds = [];

                for(const i = 0, x = req.session.meFB.friends.data.length; i < x ; i++) {
                    getWinsLosesIds.push({facebookId: req.session.meFB.friends.data[i].id})
                }

                app.models.user.find({$or: getWinsLosesIds}, function(err, friendsResult) {
                    const friendsInfo = {};

                    for(const i = 0, x = friendsResult.length; i < x ; i++) {
                        friendsInfo[friendsResult[i].facebookId] = friendsResult[i];
                    }

                    res.render('home',{
                        user: dbUser,
                        rooms: rooms,
                        wins: wins,
                        loses: loses,
                        fbUser: req.session.meFB,
                        friendsInfo: friendsInfo,
                        moment: moment
                    });
                });

            });
            
        });
        
    });
};
    