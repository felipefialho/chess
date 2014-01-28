(function() {
    'use strict';
    var socket = io.connect('/chess');
    
    // Functions
    var addChatMsg = function(data) {
        $('.messages-content')
            .prepend('<div class="messages-box reply"><a class="user-photo"><img src="'+players[data.player].picture+'" /></a><p class="message">'+data.message.replace(/\n/g, '<br>')+'<span class="message-date">'+data.date+'</span></p></div>');
    };
    
    var addLog = function(type, playerid, date, msg) {
        var player = players[playerid];
        
        $('.log-container .log-list')
            .prepend('<li><span>[ '+date+' ]</span> <a href="#">'+player.name.split(' ')[0]+'</a> '+msg+'</li>');
    };
    
    var setStatus = function(playerid, state) {
        playerid = playerid.toString();
        if (state == 'online') {
            var playerBox = $('.user-box.player[data-player="'+playerid+'"]');
            playerBox.find('.status').removeClass('off');
            playerBox.find('.user-status').html('online');
        } else {
            var playerBox = $('.user-box.player[data-player="'+playerid+'"]');
            playerBox.find('.status').addClass('off');
            playerBox.find('.user-status').html('offline');
        }
    };
    
    var getPiece = function(line, col) {
        return $('.chess-board li[data-position="'+ line + col +'"] >span');
    };

    var previewMoviments = function(li) {
        var piece = li.children('span.piece');

        if (piece.hasClass('pawn')) {
            console.log('Preview PAWN');

        } else if (piece.hasClass('rook')) {
            console.log('Preview ROOK');

        } else if (piece.hasClass('bishop')) {
            console.log('Preview BISHOP');
            
        } else if (piece.hasClass('queen')) {
            console.log('Preview QUEEN');
            
        } else if (piece.hasClass('king')) {
            console.log('Preview KING');
            
        } else if (piece.hasClass('horse')) {
            console.log('Preview HORSE');
            
        }
    };
    
    window.makeMove = function(from, to) {
        socket.emit('make-move', {
            from: from,
            to: to
        });
    };

    // Socket Send
    socket.emit('join-room', {
        room: roomId,
        user: playerId
    });


    // Socket receive
    socket.on('reload', function(data) {
        window.location.reload();
    });

    socket.on('game-done', function(data) {
        window.location = '/chess/home';
    });

    socket.on('player-joined', function(data) {
        setStatus(data.player._id, 'online');
        
        socket.emit('game-info', {});

        addLog('joined-room', data.player._id, data.date, 'Connected');
    });
    
    socket.on('players-statuses', function(data) {
        for(var key in data) {
            setStatus(key, data[key])
        }
    });

    socket.on('new-chat-msg', function(data) {
        addChatMsg(data);
        $('.messages-send').val('');
    });
    
    socket.on('exit-room', function(data) {
        setStatus(data.player._id, 'offline');
        
        addLog('exit-room', data.player._id, data.date, 'Disconnected');
    });
    
    socket.on('do-move', function(data) {
        $('.chess-board li[data-position].active').removeClass('active');

        var $from = getPiece(data.from.line, data.from.col),
            $to = getPiece(data.to.line, data.to.col),
            enemyIdx = (data.playerIdx == 1 ? 2 : 1);
        
        var fromParent = $from.parent();
        var toParent = $to.parent();
        
        $from.addClass('move');
        $from.animate({
            top: ($to.offset().top - $from.offset().top),
            left: ($to.offset().left - $from.offset().left)
        }, 1000, function() {
            $from.appendTo(toParent);
            $from.css({top:0,left:0});
            
            if (data.extra.winner !== false) {
                console.log('WINNER: ', 'Player '+data.extra.winner);
                $('.chess-board li[data-position]>span.piece[data-player="'+data.extra.winner+'"]')
                    .addClass('win');

                $('#modal-win').modal('show');

                var msg,
                    won,
                    me = players[playerId].name,
                    enemy = players[enemyId].name;

                if (data.extra.winner == playerIdx) {
                    $('#game-lose').hide();
                    msg = 'Uau! Ganhei um jogo contra '+enemy;
                } else {
                    $('#game-won').hide();
                    msg = 'Droga! Perdi um jogo contra o '+enemy;
                }

                $('#btn-share').click(function() {
                    FB.ui({
                        method: 'feed',
                        name: 'CheSS.js',
                        caption: msg,
                        description: (
                            'Jogue você também contra seus amigos o CheSS.js'
                        ),
                        link: 'https://chessjs.trendi.com.br',
                        }, function(response) {
                            console.log(response);
                        }
                    );
                });
            }

            if (data.extra.capture) {
                $to.children('span').removeClass('icon-pawn icon-rook icon-queen icon-king icon-bishop icon-horse');
                $to.removeAttr('data-player').removeClass('pawn rook queen king bishop horse')
            }
            
            $to.appendTo(fromParent);
            
            $from.removeClass('move');

            if (data.check === true) {
                $('.chess-board li[data-position]:has(>span.piece.king[data-player="'+enemyIdx+'"]) span.king').addClass('check');
            } else {
                $('.chess-board li[data-position]:has(>span.piece.king[data-player="'+enemyIdx+'"]) span.king').removeClass('check');
            }
        });
        
        // $from.addClass('move');
        // $from.appendTo($to.parent());
        
        // setTimeout(function() {
            // if (data.extra.capture) {
            //     $to.remove();
            // } else {
            //     $to.appendTo($from.parent());
            // }
            
            // $from.removeClass('move');
        // }, 2000)
        
    });

    // Events
    $('.messages-send').on('keypress', function(ev) {
        var $me = $(this);
        if (ev.which === 13) {
            if (ev.shiftKey === false) {
                if (!$me.val().trim()) return;

                socket.emit('chat-msg', {
                    message: $me.val().trim()
                });

            }
        }
    });
    
    var selected = null;
    $('.chess-board')
        // Seleciona a peça
        .on('click', 'li[data-position]:has(>span[data-player="'+playerIdx+'"])', function() {
            var $me = $(this);
            
            if ($me.hasClass('active')) {
                $me.removeClass('active');
                selected = null;
            } else {
                $('.chess-board li[data-position].active').removeClass('active');
                $me.addClass('active');
                selected = $me.data('position');

                previewMoviments($me);
            }
        })
        // Faz o movimento
        .on('click', 'li[data-position]:not(:has(>span[data-player="'+playerIdx+'"]))', function() {
            var $me = $(this);
            makeMove(selected, $me.data('position'));
        });
    
    setTimeout(function() {
        $('.chess-board li span.piece.in').removeClass('in');
    }, 2000);
    
    var timeContainer = $('.time');
    var timeinterval = setInterval(function() {
        timeContainer.find('b').html(moment(timeContainer.data('start'), "YYYYMMDDHHmmss").fromNow());
    }, 30000);
})();