module.exports = function(app, req, res) {
	app.models.room.countActiveGames(function(countActiveGames) {
		app.models.room.countAllGames(function(countAllGames) {
			app.models.user.countAllUsers(function(countAllUsers) {
				res.render('index', {
					activeGames: countActiveGames,
					allGames: countAllGames,
					allUsers: countAllUsers
		        });
			});
		});
	});
};