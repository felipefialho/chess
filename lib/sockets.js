var app = module.parent.exports;
var moment = require('moment');

(function() {
	var statuses = {};
	app.io.of('/chess')
	    .on('connection', function(socket) {
	        // User joined game room
	        
	        socket.on('join-room', function(data) {
	            app.models.user.findOne({_id: data.user}, function(err, user) {
	                app.getRoom(data.room, function(room) {
	                    room.log.push({
	                        player: user._id,
	                        date: new Date(),
	                        action: 'joined-room',
	                        data: {}
	                    });
	                    room.save();
	                });

	                data.user = user;

	                socket.set('me', data, function() {
	                    socket.join(data.room);
	                    
	                    if (!statuses[data.room])
	                        statuses[data.room] = {};
	                    
	                    if (!statuses[data.room][user._id])
	                        statuses[data.room][user._id] = {};
	                    
	                    statuses[data.room][user._id] = 'online';

	                    socket.volatile.to(data.room).emit('players-statuses', statuses[data.room]);
	                    socket.volatile.broadcast.to(data.room).emit('player-joined', {
	                        player: {
	                            _id: user._id,
	                            name: user.name
	                        },
	                        date: moment(new Date()).format('DD/MM/YY HH:mm')
	                    });

	                });
	                    
	            });
	        });

	        // New chat message
	        socket.on('chat-msg', function(data) {
	            socket.get('me', function(err, me) {
	                app.getRoom(me.room, function(room) {
	                    room.chat.push({
	                        player: me.user._id,
	                        message: data.message,
	                        date: new Date()
	                    });
	                    room.save(function(err, r) {
	                        var chatMsg = r.chat.reverse()[0];
	                        var send = {
	                            player: chatMsg.player,
	                            message: chatMsg.message,
	                            date: moment(chatMsg.date).format('DD/MM/YY HH:mm')
	                        };
	                        
	                        socket.volatile.broadcast.to(me.room).emit('new-chat-msg', send);
	                        socket.volatile.to(me.room).emit('new-chat-msg', send);
	                    });
	                });
	            });
	        });
	        
	        
	        socket.on('make-move', function(data) {
	            if (!data.from || !data.to) return;
	            
	            var from = {
	                line: data.from.substring(0,1),
	                col: data.from.substring(1,2)
	            };
	            var to = {
	                line: data.to.substring(0,1),
	                col: data.to.substring(1,2)
	            };
	            
	            socket.get('me', function(err, me) {
	                if (!me) {
	                    socket.emit('reload', {msg: 'Server down, refresh to rejoin'});
	                    return;
	                }

	                app.getRoom(me.room, function(room) {
	                	if (room.winner !== null) {
	                		socket.emit('game-done', {msg: 'Game already finished'});
	                		return;
	                	}

	                    var result = app.validate.move(room, me.user, from, to);
	                    
	                    if (result.status === true) {
	                        var initial = room.board[from.line][from.col];
	                        var destination = room.board[to.line][to.col];

	                        if (result.extra.capture == 1) {
	                        	if (destination.piece == 'king') {
	                        		result.extra.winner = room.turn;
	                        		room.set('winner', room.turn);
	                        		room.set('endDate', new Date());
	                        	} else {
		                            result.extra.winner = false;
	                            	destination = { player: null, piece: null, moviments: 0 };
	                        	}
	                        } else {
	                            result.extra.winner = false;
	                            destination.moviments++;
	                        }
                        	
                        	room.turn = room.turn == 1 ? 2 : 1;
	                        
	                        initial.moviments++;
	                        
	                        room.set('board.'+to.line+'.'+to.col, initial);
	                        room.set('board.'+from.line+'.'+from.col, destination);
	                        
							room.log.push({
		                        player: me.user._id,
		                        date: new Date(),
		                        action: 'make-move',
		                        data: {}
		                    });

	                        room.save(function(err, r) {
	                            result.from = from;
	                            result.to = to;
	                            
	                            result.check = (app.validate.king(to, result.enemyKing, room, true) === true ? false : true);
	                            // result.playerIdx = (me.room.players['p1']._id == result.)
	                            result.playerIdx = initial.player;

	                            delete result.from.data;
	                            delete result.to.data;
	                            delete result.enemyKing;

	                            socket.volatile.broadcast.to(me.room).emit('do-move', result);
	                            socket.volatile.to(me.room).emit('do-move', result);
	                        });
	                    }
	                });
	            });
	        });
	        
	        
	        // Disconnect
	        socket.on('disconnect', function() {
	            socket.get('me', function(err, me) {
	                if (!me) return;
	                    
	                statuses[me.room][me.user._id] = 'offline';
	                
	                app.getRoom(me.room, function(room) {
	                    room.log.push({
	                        player: me.user._id,
	                        date: new Date(),
	                        action: 'exit-room',
	                        data: {}
	                    });
	                    room.save(function(err, r) {
	                        var log = r.log.reverse()[0];

	                        socket.volatile.broadcast.to(me.room).emit('exit-room', {
	                            player: {
	                                _id: me.user._id,
	                                name: me.user.name
	                            },
	                            date: moment(log.date).format('DD/MM/YY HH:mm')
	                        });
	                    });
	                });
	            });
	        });


			// Get game information
			socket.on('game-info', function(data) {
				console.log(data);
			});

	    });
})();