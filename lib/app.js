var app = module.parent.exports;

app.getControl = function(control, req, res, params) {
    try {
        return require(app.path + '/controller/' + control + '.js')(app, req, res, params);
    } catch(e) {
        console.log(e);
    }
};

app.checkUser = function(facebookId, cb) {
    app.models.user.findOne({facebookId: facebookId}, function(err, dbUser) {
        if (!dbUser) {
            app.facebook.api('/'+facebookId+'?fields=id,name,picture', function(err, user) {
                dbUser = new app.models.user({
                    facebookId: user.id,
                    name: user.name,
                    picture: user.picture.data.url
                });
                dbUser.save();

                cb(dbUser);
            });

        } else {
            cb(dbUser);
        }
    });
};

app.getRoom = function(id, cb) {
    app.models.room.findOne({_id: id}).populate('players.p1 players.p2').exec(function(err, room) {
        cb(room);
    });
};

app.facebookLogin = function() {
    return app.fbClass.loginRequired({scope:'user_friends, email, publish_actions'});
};