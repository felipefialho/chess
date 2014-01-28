var methods = {
    checkGames: function(req, res) {
        req.session.me.getActiveGames(function(rooms) {
            var data = [];

            for(var i = 0, x = rooms.length; i < x ; i++) {
                data.push(rooms[i]._id);
            }

            res.send(data);
        });
    }
};

module.exports = function(app, req, res, params) {
    return methods[params.action](req, res);
};