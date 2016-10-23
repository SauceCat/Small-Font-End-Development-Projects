var app = angular.module("myApp", []);

app.controller("myCtrl", function($scope){

	// the welcome page
	$scope.toWelcome = function() {
		$scope.showWelcome = true;
		$scope.showInfo = false;
		$scope.showRunning = false;
		$scope.showTerminate = false;

		$scope.humanScore = 0;
		$scope.aiScore = 0;
	}

	$scope.toWelcome();

	// welcome -> infomation
	$scope.toInfo = function(humanChoice) {
		$scope.showWelcome = false;
		$scope.showInfo = true;
		$scope.showRunning = false;
		$scope.showTerminate = false;
		$scope.newGame = new game(humanChoice);
		$scope.humanChoice = humanChoice;
		$scope.aiChoice = humanChoice == "O" ? "X" : "O";
	}

	// infomation -> running
	$scope.toRunning = function() {
		$scope.showWelcome = false;
		$scope.showInfo = false;
		$scope.showRunning = true;
		$scope.showTerminate = false;

		// wake up the ai
		if($scope.newGame.turn == $scope.newGame.aiPlayer.marker) {
			$scope.newGame.aiPlayer.randomPlay($scope.newGame);
		}
	}

	// running -> terminate
	$scope.toTerminate = function() {
		$scope.showWelcome = false;
		$scope.showInfo = false;
		$scope.showRunning = false;
		$scope.showTerminate = true;

		if($scope.newGame.result == "X-won") {
			if($scope.humanChoice == "X") {
				$scope.gameResult = "You win :)";
			}else {
				$scope.gameResult = "You lose :(";
			}
		}

		if($scope.newGame.result == "O-won") {
			if($scope.humanChoice == "O") {
				$scope.gameResult = "You win :)";
			}else {
				$scope.gameResult = "You lose :(";
			}
		}

		if($scope.newGame.result == "draw") {
			$scope.gameResult = "A draw :|";
		}

		if($scope.gameResult == "You win :)") {
			$scope.humanScore += 10;
		}
		if($scope.gameResult == "You lose :("){
			$scope.aiScore += 10;
		}
	}

	// humanPlayer class
	function humanPlayer(_game, humanChoice) {
		// marker for the human player
		this.marker = humanChoice;

		// play function for the human player
		this.play = function(i) {
			if(_game.board[i] == " ") {
				_game.board[i] = _game.turn;
				if(!_game.checkTerminate()){
					// update the turn
					_game.turn = _game.turn == "O" ? "X" : "O";
					_game.aiPlayer.play(_game);
				}else{
					$scope.toTerminate();
				}
			}
		}
	}

	function miniMax(_fakeGame) {
		if(_fakeGame.checkTerminate()) {
			return _fakeGame.getScore();
		}else {
			_fakeGame.turn = _fakeGame.turn == "O" ? "X" : "O";

			if(_fakeGame.turn == $scope.aiChoice) {
				var minValue = 1000;

				for(var i = 0; i < _fakeGame.board.length; i++) {
					var pos = _fakeGame.board[i];

					if(pos == " ") {
						var _fakeFakeGame = new game($scope.humanChoice);
						_fakeFakeGame.copyGame(_fakeGame);
						_fakeFakeGame.board[i] = _fakeFakeGame.turn;
						_fakeFakeGame.aiMoves++;

						var posScore = miniMax(_fakeFakeGame);
						if(posScore < minValue) {
							minValue = posScore;
						}
					}
				}
				return minValue;
			}else {
				var maxValue = -1000;

				for(var i = 0; i < _fakeGame.board.length; i++) {
					var pos = _fakeGame.board[i];
					if(pos == " ") {
						var _fakeFakeGame = new game($scope.humanChoice);
						_fakeFakeGame.copyGame(_fakeGame);
						_fakeFakeGame.board[i] = _fakeFakeGame.turn;

						var posScore = miniMax(_fakeFakeGame);
						if(posScore > maxValue) {
							maxValue = posScore;
						}
					}
				}
				return maxValue;
			}
		}
	}

	// aiPlayer class
	function aiPlayer(aiChoice) {
		// marker for the human player
		this.marker = aiChoice;

		this.bestMove = function(_game) {
			var minValue = 1000;
			var aiAct;

			// loop through all possible pos
			for(var i = 0; i < _game.board.length; i++) {
				var pos = _game.board[i];
				if(pos == " ") {
					var fakeGame = new game($scope.humanChoice);
					fakeGame.copyGame(_game);
					fakeGame.board[i] = fakeGame.turn;
					fakeGame.aiMoves++;

					var posScore = miniMax(fakeGame);
					actScores[i] = posScore;
					if(posScore < minValue) {
						minValue = posScore;
						aiAct = i;
					}
				}
			}

			return aiAct;
		}

		// play function for the human player
		this.randomPlay = function(_game) {
			_game.board[Math.round(Math.random() * 8)] = _game.turn;
			_game.turn = _game.turn == "O" ? "X" : "O";
			_game.aiMoves++;
		}

		this.play = function(_game) {
			var fakeGame = new game($scope.humanChoice);
			fakeGame.copyGame(_game);
			var aiAct = this.bestMove(fakeGame);

			_game.board[aiAct] = _game.turn;
			_game.aiMoves++;

			if(!_game.checkTerminate()){
				// update the turn
				_game.turn = _game.turn == "O" ? "X" : "O";
			}else{
				$scope.toTerminate();
			}
		}
	};

	// the game class
	function game(humanChoice) {
		// the board
		this.board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

		// who take the turn to move
		this.turn = Math.random() > 0.5 ? "O" : "X";

		// the number of moves taken by AI
		this.aiMoves = 0;

		// the result of the game
		this.result = " ";

		// the human player for the game
		this.humanPlayer = new humanPlayer(this, humanChoice);

		// the AI player for the game 
		var aiChoice = humanChoice == "O" ? "X" : "O";
		this.aiPlayer = new aiPlayer(aiChoice);

		// initialize the game with the existing game
		this.copyGame = function(_game) {
			for(var i = 0; i < _game.board.length; i++) {
				this.board[i] = _game.board[i];
			}
			this.turn = _game.turn;
			this.aiMoves = _game.aiMoves;
		}

		this.getScore = function() {
			// calculate the score
			var score = 0;
			if(this.result == "X-won") {
				if(this.humanPlayer.marker == "X") {
					score = 10 - this.aiMoves;
				}else {
					score = this.aiMoves - 10;
				}
			}

			if(this.result == "O-won") {
				if(this.humanPlayer.marker == "O") {
					score = 10 - this.aiMoves;
				}else {
					score = this.aiMoves - 10;
				}
			}

			if(this.result == "draw") {
				score = 0;
			}
			return score;
		}

		// function to check termination of the game
		this.checkTerminate = function() {
			// this board status
			var B = this.board;

			// check the rows
			for(var i = 0; i <= 6; i = i + 3) {
				if(B[i] != " " && B[i] == B[i + 1] && B[i + 1] == B[i + 2]) {
					this.result = this.turn + "-won";
					return true;
				}
			}

			// check the columns
			for(var i = 0; i <= 2; i++) {
				if(B[i] != " " && B[i] == B[i + 3] && B[i + 3] == B[i + 6]) {
					this.result = this.turn + "-won";
					return true;
				}
			}

			// check the diagonal
			if(B[0] != " " && B[0] == B[4] && B[4] == B[8]) {
				this.result = this.turn + "-won";
				return true;
			}

			if(B[2] != " " && B[2] == B[4] && B[4] == B[6]) {
				this.result = this.turn + "-won";
				return true;
			}

			// check draw
			if(B.indexOf(" ") == -1) {
				this.result = "draw";
				return true;
			}

			return false;
		}
	};
});