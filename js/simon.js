var on = false;					// Flags whether game is on or off
var strict = false;				// Flags whether difficulty is easy or strict
var user_turn = false;			// Flags whether it is the user's turn
var count = 0;					// How many button presses there are in the current sequence
var sequence = [];				// Current color sequence
var userSequence = [];			// Color sequence pressed by the user

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
 function getRandomInt(min, max) {
 	return Math.floor(Math.random() * (max - min + 1)) + min;
 }

// Brute force way of clearing any setTimeout and setInterval events still in progress
function clearTimeouts(){
	for (var i = 1; i < 99999; i++) {
   		clearInterval(i);
    	clearTimeout(i);
	}
}

// Change mouse cursor type to indicate to the user when buttons are active
function changePointers(type) {
	$(".tr").css("cursor", type);
	$(".br").css("cursor", type);
	$(".bl").css("cursor", type);
	$(".tl").css("cursor", type);
}

// Power switch toggle
function togglePower(){
	on = !on;
	$(".counter").css("color", on ? "red":"#800000");
	var audio = new Audio('./assets/audio/Click.mp3');
	audio.play();
	if (!on){		
		reset();
	}
}

// Difficulty switch toggle
function toggleStrict(){
	strict = !strict;
	var audio = new Audio('./assets/audio/Click.mp3');
	audio.play(); 
}

// Resets variables to initial state
function reset() {
	userTurn(false);
	clearTimeouts();
	count = 0;
	sequence = [];
	userSequence = [];
	$(".counter").html("--");
}

// Start new game
function start() {
	if (on){
		clearTimeouts();
		reset();
		blinkCounter(2);
		console.log("Starting");
		setTimeout(computerTurn, 1500);
	}
}

// Press random color and stores in sequence array
function computerTurn(){
	userTurn(false);
	userSequence = [];
	var arr = ['r', 'b', 'y', 'g'];	
	var color = arr[getRandomInt(0,3)];
	console.log("Computer turn: Pushing "+color);
	sequence.push(color);
	incCount();
	setTimeout(displaySequence, 500);
	setTimeout(function(){
		userTurn(true);
	}, 550+760*sequence.length);
}

// Sets the user_turn flag and changes pointer type
function userTurn(flag) {
	user_turn = flag;
	changePointers(flag ? "pointer": "default");
}

function startTimer() {
	setTimeout
}

// Increments counter
function incCount() {
	count++;
	$(".counter").html(("0" + count).slice(-2));
}

// Win behavior
function win() {
	userTurn(false);
	$(".counter").html("WIN");
	blinkCounter(6);
	setTimeout(reset, 5000);
}

// Loss behavior
function lose() {
	userTurn(false);
	userSequence = [];
	if (strict){
		$(".counter").html("LOSE");
		blinkCounter(3);
		setTimeout(start, 3000);
	} else {		
		$(".counter").html("!!!");
		blinkCounter(3);
		setTimeout(function(){
			$(".counter").html(("0" + count).slice(-2));
		}, 2000);
		setTimeout(displaySequence, 2000);
		setTimeout(function(){
			userTurn(true);
		}, 2050+760*sequence.length);
	}
}

// Display colors in current sequence
function displaySequence(){
		if (on){
			var duration = 750;
			var i=0;

			var t = setInterval(function(){
				console.log("Displaying sequence["+i+"]: "+sequence[i]);
				press(sequence[i]);
				i++;
				if (i == sequence.length){
					clearInterval(t);
				}
			}, duration);
		}
}

// Blinks the counter a set number of times
function blinkCounter(number){
	console.log("Blinking "+number+"x!");
	var duration = 250;

	(function blink(i, color) {
		var newColor = color=="red" ? "black":"red";
		setTimeout(function() {
			$(".counter").css("color", newColor);
			if (--i) blink(i, newColor);
		}, duration);
		
	})(number*2, "red");
}

// When user presses a color
function userPush(color){
	console.log("User pushed: "+color);
	userSequence.push(color);
}

// Lights up a button and plays corresponding sound clip
function press(color) {
	if (on){
		switch(color){
			case 'r':
			var audio = new Audio('./assets/audio/simonSound1.mp3');
			audio.play();
			$(".tr").css("background-color", "red");
			if (user_turn){
				userPush("r");
			}
			break;
			case 'b':
			var audio = new Audio('./assets/audio/simonSound2.mp3');
			audio.play();
			$(".br").css("background-color", "#1c8cff");
			if (user_turn){
				userPush("b");
			}
			break;
			case 'y':
			var audio = new Audio('./assets/audio/simonSound3.mp3');
			audio.play();
			$(".bl").css("background-color", "#fed93f");
			if (user_turn){
				userPush("y");
			}
			break;
			case 'g':
			var audio = new Audio('./assets/audio/simonSound4.mp3');
			audio.play();
			$(".tl").css("background-color", "#13ff7c");
			if (user_turn){
				userPush("g");
			}
			break;
		}

		if (!user_turn){
			setTimeout(function(){
				$(".tr").css("background-color", "#9f0f17");
				$(".br").css("background-color", "#094a8f");
				$(".bl").css("background-color", "#cca707");
				$(".tl").css("background-color", "#00a74a");
			}, 200);
		}

		// If it's the user's turn, check to see if they've entered the correct sequence
		if (user_turn){
			for (var index=0; index<userSequence.length; index++){
				if (sequence[index] != userSequence[index]){
					lose();
					return;
				}
			}
			if (sequence.length==userSequence.length){
				if (count==20){
					win();
				} else {
					computerTurn();
				}
				return;
			}
		}
	}
}