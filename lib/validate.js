var app = module.parent.app;
var lineIndex = {
	a: 1, b:2, c:3, d:4, e:5, f:6, g:7, h:8
};
var lineIndexInverse = {
	'1': 'a', '2':'b', '3':'c', '4':'d', '5':'e', '6':'f', '7':'g', '8':'h'
};

var checkMoviment = function(from, to, room) {

	var idxLineFrom = parseInt(lineIndex[from.line]),
		idxLineTo = parseInt(lineIndex[to.line]),
		idxColFrom = parseInt(from.col),
		idxColTo = parseInt(to.col),
		moveRange = 0,
		moved = !(from.data.moviments === 0),
		player = from.data.player,
		side = room.sides['p'+player],
		valid = false,
		extra = {
			capture: false
		},
		msg = 'Movimento inválido';

	return {
		'pawn' : function(checkKing) {
			moveRange = 1;

			// Já se moveu alguma vez?
			if (!moved) {
				moveRange++;
			}

			// Same collumn?
			if ((!checkKing) && (to.col == from.col)) {
				var lineMoved = 0;
				
				for(var i=1;i<=moveRange;i++) {
					var check = lineIndex[from.line] + (i * side);
					
					lineMoved++;
					
					if (room.board[lineIndexInverse[check]][from.col].player) {
						valid = false;
						break;
					} else if (lineIndex[to.line] == check) {
						valid = true;
						break;
					}
				}
			}
			// Diagonal?
			else if (to.col != from.col) {
				// Checa se é um movimento de 1 linha

				console.log(to.lineIdx, '=', from.lineIdx);
				console.log(to.col, '=', from.col);

				if (((to.lineIdx == (from.lineIdx+1)) || (to.lineIdx == (from.lineIdx-1))) && ((parseInt(to.col) == (parseInt(from.col)+1)) || (parseInt(to.col) == (parseInt(from.col)-1)))) {

					if ((checkKing) || ((to.data.piece !== null) && (to.data.player != player) && ((Math.abs(parseInt(from.col) - parseInt(to.col)) === 1) || (Math.abs(parseInt(from.col) + parseInt(to.col)) === 1)))) {
						valid = true;
						extra.capture = 1;
					} else {
						msg = 'Invalid moviment';
					}
					
				} else {
					msg = 'Invalid moviment';
				}
			}
			
			if (valid) {
				msg = 'ok';
			}

			return {
				status: valid,
				extra: extra,
				error: msg
			};
		},

		'rook' : function() {
			if (from.col == to.col) {
				moveRange = (idxLineFrom > idxLineTo ? idxLineFrom - idxLineTo : idxLineTo - idxLineFrom)*side;

				if (idxLineFrom < idxLineTo) {

					for(var i = (idxLineFrom+1), x = idxLineTo; i <= x; i++) {
						var check = room.board[lineIndexInverse[i]][from.col];

						if (lineIndexInverse[i] == to.line) {
							valid = true;
							msg = 'ok';
							if ((to.data.piece !== null) && (to.data.player != player)) {
								extra.capture = 1;
							} else if ((to.data.piece !== null) && (to.data.player == player)) {
								valid = false;
								msg = 'Alied piece';
							}

						} else if (check.player) {
							valid = false;
							msg = 'ROOK: invalid moviment, piece on the way';
							break;
						}
					}

				} else {

					for(var i = (idxLineFrom-1), x = idxLineTo; i >= x; i--) {
						var check = room.board[lineIndexInverse[i]][from.col];

						if (lineIndexInverse[i] == to.line) {
							valid = true;
							msg = 'ok';
							if ((to.data.piece !== null) && (to.data.player != player)) {
								extra.capture = 1;
							} else if ((to.data.piece !== null) && (to.data.player == player)) {
								valid = false;
								msg = 'Alied piece';
							}

						} else if (check.player) {
							valid = false;
							msg = 'ROOK: invalid moviment, piece on the way';
							break;
						}
					}

				}

			} else if (idxLineFrom == idxLineTo) {
				moveRange = (idxColFrom > idxColTo ? idxColFrom - idxColTo : idxColTo - idxColFrom)*side;

				if (idxColFrom < idxColTo) {

					for(var i = (idxColFrom+1), x = idxColTo; i <= x; i++) {
						var check = room.board[from.line][i];

						if (i == to.col) {
							valid = true;
							msg = 'ok';
							if ((to.data.piece !== null) && (to.data.player != player)) {
								extra.capture = 1;
							} else if ((to.data.piece !== null) && (to.data.player == player)) {
								valid = false;
								msg = 'Alied piece';
							}

						} else if (check.player) {
							valid = false;
							msg = 'ROOK: invalid moviment, piece on the way';
							break;
						}
					}

				} else {

					for(var i = (idxColFrom-1), x = idxColTo; i >= x; i--) {
						var check = room.board[from.line][i];

						if (i == to.col) {
							valid = true;
							msg = 'ok';
							if ((to.data.piece !== null) && (to.data.player != player)) {
								extra.capture = 1;
							} else if ((to.data.piece !== null) && (to.data.player == player)) {
								valid = false;
								msg = 'Alied piece';
							}

						} else if (check.player) {
							valid = false;
							msg = 'ROOK: invalid moviment, piece on the way';
							break;
						}
					}


				}


			}

			return {
				status: valid,
				extra: extra,
				error: msg
			};
		},

		'bishop' : function() {
			moveRange = (idxLineFrom > idxLineTo ? idxLineFrom - idxLineTo : idxLineTo - idxLineFrom)*side;

			var diffCol = Math.abs(parseInt(from.col - to.col));
			var diffLine = Math.abs(parseInt(lineIndex[from.line] - lineIndex[to.line]));

			if ((diffLine != diffCol) || ((from.col == to.col) || (from.line == to.line))) {
				msg = 'Movimentação inválida';
				extra.movimentType = 'side';
			} else {
				extra.movimentType = 'diagonal';

				if (idxLineFrom < idxLineTo) {

					var fix = (from.col - to.col) > 0 ? -1 : 1;

					for (var i = 1, x = Math.abs(moveRange); i <= x; i++) {
						var check = room.board[lineIndexInverse[lineIndex[from.line]+i]][parseInt(from.col)+(i*fix)];

						if (i == x) {
							valid = true;
							msg = 'ok';
							if ((to.data.piece !== null) && (to.data.player != player)) {
								extra.capture = 1;
							} else if ((to.data.piece !== null) && (to.data.player == player)) {
								valid = false;
								msg = 'Alied piece';
							}

						} else if (check.player) {
							valid = false;
							msg = 'BISHOP: invalid moviment, piece on the way';
							break;
						}
					}

				} else {

					var fix = (from.col - to.col) > 0 ? -1 : 1;

					for (var i = 1, x = Math.abs(moveRange); i <= x; i++) {
						var check = room.board[lineIndexInverse[lineIndex[from.line]-i]][parseInt(from.col)+(i*fix)];

						if (i == x) {
							valid = true;
							msg = 'ok';
							if ((to.data.piece !== null) && (to.data.player != player)) {
								extra.capture = 1;
							} else if ((to.data.piece !== null) && (to.data.player == player)) {
								valid = false;
								msg = 'Alied piece';
							}

						} else if (check.player) {
							valid = false;
							msg = 'BISHOP: invalid moviment, piece on the way';
							break;
						}

					}

				}

			}

			return {
				status: valid,
				extra: extra,
				error: msg
			};
		},
		'queen' : function() {
			var check = checkMoviment(from, to, room);

			var resultBishop = check.bishop();

			if ((resultBishop.extra.movimentType == 'diagonal') && (resultBishop.status === true)) {
				valid = resultBishop.status;
				extra.capture = resultBishop.extra.capture;
			} else {
				var resultRook = check.rook();
				valid = resultRook.status;
				extra.capture = resultRook.extra.capture;
			}

			return {
				status: valid,
				extra: extra,
				error: msg
			};
		},

		'horse' : function() {
			moveRange = (idxLineFrom > idxLineTo ? idxLineFrom - idxLineTo : idxLineTo - idxLineFrom)*side;

			var diffCol = Math.abs(parseInt(from.col - to.col));
			var diffLine = Math.abs(parseInt(lineIndex[from.line] - lineIndex[to.line]));

			if (Math.abs(moveRange) == 2) {

				if ((diffCol === 1) && (diffLine === 2)) {
					valid = true;
				}

			} else if (Math.abs(moveRange) == 1) {

				if ((diffCol === 2) && (diffLine === 1)) {
					valid = true;
				}
			}

			if (valid === true) {
				if ((to.data.piece !== null) && (to.data.player != player)) {
					extra.capture = 1;
				} else if ((to.data.piece !== null) && (to.data.player == player)) {
					valid = false;
					msg = 'Alied piece';
				}
			}

			return {
				status: valid,
				extra: extra,
				error: msg
			};
		},

		'king' : function() {
			moveRangeLine = (idxLineFrom > idxLineTo ? idxLineFrom - idxLineTo : idxLineTo - idxLineFrom)*side;
			moveRangeCol = (idxColFrom > idxColTo ? idxColFrom - idxColTo : idxColTo - idxColFrom)*side;

			if ((Math.abs(moveRangeLine) == 1) || (Math.abs(moveRangeCol) == 1)) {
				valid = true;
				var isSafe = isKingSafe(from, to, room);

				if (!isSafe) {
					valid = false;
					msg = 'This moviment put your king on Check';
				} else {
					if ((to.data.piece !== null) && (to.data.player != player)) {
						extra.capture = 1;
					} else if ((to.data.piece !== null) && (to.data.player == player)) {
						valid = false;
						msg = 'Alied piece';
					}
				}
			}

			return {
				status: valid,
				extra: extra,
				error: msg
			};
		}
	}
};

var isKingSafe = function(from, to, room, onCheck) {
	safe = true;
	onCheck = onCheck || false;

	for (var line in room.board) {
		for (var col in room.board[line]) {
			if ((!onCheck) && ((from.col == col) && (from.line == line))) continue;

			var square = {
				line: line,
				col: col,
				data: room.board[line][col],
				lineIdx: lineIndex[line]
			};
			
			if (square.data.piece == 'king') continue;
			if (square.data.player == from.data.player) continue;
			if (!square.data.piece) continue;

			//console.log(square);

			var result = checkMoviment(square, to, room)[square.data.piece](1);

			if (result.status === true) {
				safe = false;
				console.log('Not safe for KING', square.data.piece);
				return safe;
			}
		}
	}

	return safe;
};

var getEnemyKing = function(room, player) {
	for (var line in room.board) {
		for (var col in room.board[line]) {
			var square = room.board[line][col];

			if ((square.piece == 'king') && (player._id.toString() != room.players['p'+square.player]._id.toString())) {
				return {
					data: square,
					col: col,
					line: line 
				};
			}
		}
	}
};

var validate = function(room, player, from, to) {
	from.data = room.board[from.line][from.col];
	to.data = room.board[to.line][to.col];
	
	from.lineIdx = lineIndex[from.line];
	to.lineIdx = lineIndex[to.line];
	
	if (from.data.player !== null) {
		from.data.playerData = room.players['p'+from.data.player];
	} else {
		return {
			status: false,
			error: 'Invalid Moviment.'
		};
	}
	
	if (from.data.player != room.turn) {
		return {
			status: false,
			error: 'Not turn.'
		};
	}
	
	if (from.data.playerData._id.toString() == player._id) {
		var result = checkMoviment(from, to, room)[from.data.piece]();
		result.enemyKing = getEnemyKing(room, player);

		return result;
	} else {
		return {
			status: false,
			error: 'Invalid Moviment.'
		};
	}
};

module.exports = {
	move: validate,
	king: isKingSafe
};