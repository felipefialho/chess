let app = module.parent.exports;
const moment = require('moment');

(()=> {
	const statuses = {};
	app.io.of('/chess')
	    .on('connection', (socket) => {
	        // User joined game room
	        
	        socket.on('join-room', (data) => {
	            app.models.user.findOne({_id: data.user}, (err, user) => {
	                app.getRoom(data.room, (room) => {
	                    room.log.push({
	                        player: user._id,
	                        date: new Date(),
	                        action: 'joined-room',
	                        data: {}
	                    });
	                    room.save();
	                });

	                data.user = user;

	                socket.set('me', data, () => {
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
	        socket.on('chat-msg', (data) => {
	            socket.get('me', (err, me) => {
	                app.getRoom(me.room, (room) => {
	                    room.chat.push({
	                        player: me.user._id,
	                        message: data.message,
	                        date: new Date()
	                    });
	                    room.save((err, r)=> {
	                        const chatMsg = r.chat.reverse()[0];
	                        const send = {
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
	        
	        
	        socket.on('make-move', (data) => {
	            if (!data.from || !data.to) return;
	            
	            const from = {
	                line: data.from.substring(0,1),
	                col: data.from.substring(1,2)
	            };
	            const to = {
	                line: data.to.substring(0,1),
	                col: data.to.substring(1,2)
	            };
	            
	            socket.get('me', (err, me) => {
	                if (!me) {
	                    socket.emit('reload', {msg: 'Server down, refresh to rejoin'});
	                    return;
	                }

	                app.getRoom(me.room, (room) => {
	                	if (room.winner !== null) {
	                		socket.emit('game-done', {msg: 'Game already finished'});
	                		return;
	                	}

	                    const result = app.validate.move(room, me.user, from, to);
	                    
	                    if (result.status === true) {
	                        const initial = room.board[from.line][from.col];
	                        const destination = room.board[to.line][to.col];

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

	                        room.save((err, r) => {
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
	        socket.on('disconnect', () => {
	            socket.get('me', (err, me) => {
	                if (!me) return;
	                    
	                statuses[me.room][me.user._id] = 'offline';
	                
	                app.getRoom(me.room, (room) => {
	                    room.log.push({
	                        player: me.user._id,
	                        date: new Date(),
	                        action: 'exit-room',
	                        data: {}
	                    });
	                    room.save((err, r) => {
	                        const log = r.log.reverse()[0];

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
			socket.on('game-info', (data) => {
				console.log(data);
			});

	    });
})();