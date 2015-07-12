/**
 * Created by Navaneeth Sen on 2015/07/07.
 */

function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;

    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

}
function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value.toUpperCase();
    controller.processGuess(guess);

    guessInput.value = "";
}

function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

window.onload = init;

var view = {
    displayMessage: function (msg) {
        var msgArea = document.getElementById("messageArea");
        msgArea.innerHTML = msg;
    },
    displayHit: function (gridIdx) {
        var location = getLocation(gridIdx);
        var td = document.getElementById(location);
        td.setAttribute("class", "hit");
    },
    displayMiss: function (gridIdx) {
        var location = getLocation(gridIdx);
        var td = document.getElementById(location);
        td.setAttribute("class", "miss");
    }
};

var model = {
    boardSize: 7,
    shipsSunk: 0,
    //ships: [{locations:  , hits: ["", "", ""]},
    //    {locations: ["C4", "D4", "E4"], hits: ["", "", ""]},
    //    {locations: ["B0", "B1", "B2"], hits: ["", "", ""]}],

    ships: getAllShips(),
    numShips: 3,
    shipLength: 3,


    fire: function (guess) {
        console.log(guess);
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var indexOf = ship.locations.indexOf(guess);
            if (indexOf >= 0) {
                ship.hits[indexOf] = "hit";
                if (this.isSunk(ship)) {
                    this.shipsSunk++;
                }
                view.displayHit(guess);
                view.displayMessage("HIT");
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("MISS");
        return false;
    },
    isSunk: function (ship) {
        return ship.hits.indexOf("") === -1;
    }
};


var controller = {
    numGuesses: 0,
    guesses: [],
    processGuess: function (guess) {

        if (model.shipsSunk === model.numShips) {
            alert("Game Over! Please start a new game!");
            return;
        }

        var location = getLocation(guess);

        if (location == NOT_VALID) {
            alert("Oops, please enter a letter and a number on the board.");
        }
        else if (location == OUTSIDE_THE_BOARD) {
            alert("Oops, that's off the board!");
        }
        else if (location == NOT_PROPER_VALUE) {
            alert("Oops, that's not the way to represent a grid!");
        }
        else {

            if (this.guesses.indexOf(guess) == -1) {
                this.guesses.push(guess);
            }
            else {
                alert("Guess already done, please try a different guess!");
                return;
            }

            this.numGuesses++;
            var isShipHit = model.fire(guess);
            if (isShipHit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my battleships, in " + this.numGuesses + " guesses");
            }

        }
    }
};

var NOT_VALID = -1
var OUTSIDE_THE_BOARD = -2
var NOT_PROPER_VALUE = -3;
function getLocation(value) {
    if (value === null || value.length > 2) {
        return NOT_VALID;
    }

    var yIndexvals = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

    var charAtPos1 = value.substr(0, 1);
    var charAtPos2 = value.substr(1, 1);

    if (isNaN(charAtPos1)) {
        if (yIndexvals.indexOf(charAtPos1.toLowerCase()) == -1) {
            return OUTSIDE_THE_BOARD;
        }
        else if (charAtPos2 > model.boardSize) {
            return OUTSIDE_THE_BOARD;
        }
        return yIndexvals.indexOf(charAtPos1.toLowerCase()) + charAtPos2;
    }
    else if (isNaN(charAtPos2)) {
        if (yIndexvals.indexOf(charAtPos2.toLowerCase()) == -1) {
            return OUTSIDE_THE_BOARD;
        }
        else if (charAtPos1 > model.boardSize) {
            return OUTSIDE_THE_BOARD;
        }
        return yIndexvals.indexOf(charAtPos2.toLowerCase()) + charAtPos1;
    }
    else {
        return NOT_PROPER_VALUE;
    }
}

var usedIdxs = ['0', '0', '0'];
var COLLISION_FOUND = 100;

function getShipLocation(orientation) {
    //console.log("ORIENTATION = " + orientation);
    var yCords = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    var xCords = ['0', '1', '2', '3', '4', '5', '6'];

    var random_x_idx = getRandomIndexInAnArray(xCords);
    var random_y_idx = getRandomIndexInAnArray(yCords);

    var locations = [];

    if (orientation == 0) {
        //console.log("HORIZONTAL");
        var yVal = yCords[random_y_idx];
        var xVals = [xCords[random_x_idx], xCords[random_x_idx + 1], xCords[random_x_idx + 2]];

        var hloc1 = yVal + "" + xVals[0];
        var hloc2 = yVal + "" + xVals[1];
        var hloc3 = yVal + "" + xVals[2];

        if (usedIdxs == undefined
            || (usedIdxs.indexOf(hloc1) == -1
            && usedIdxs.indexOf(hloc2) == -1
            && usedIdxs.indexOf(hloc3) == -1)) {
            locations.push(hloc1);
            locations.push(hloc2);
            locations.push(hloc3);
        }
        else {
            return COLLISION_FOUND;
        }
    }
    else if (orientation == 1) {

        //console.log("VERTICAL");
        var xVal = xCords[random_x_idx];
        var yVals = [yCords[random_y_idx], yCords[random_y_idx + 1], yCords[random_y_idx + 2]];

        var vloc1 = yVals[0] + "" + xVal;
        var vloc2 = yVals[1] + "" + xVal;
        var vloc3 = yVals[2] + "" + xVal;

        if (usedIdxs == undefined ||
            (usedIdxs.indexOf(vloc1) == -1
            && usedIdxs.indexOf(vloc2) == -1
            && usedIdxs.indexOf(vloc3) == -1)) {
            locations.push(vloc1);
            locations.push(vloc2);
            locations.push(vloc3);
        }
        else {
            return COLLISION_FOUND;
        }
    }

    usedIdxs = [].concat(locations);
    return locations;
}

function getAllShips() {
    var ships = [];
    var ort1 = getOrientation();
    var ship1Loc = getShipLocation(ort1);
    console.log(ship1Loc);

    var ship1 = new ship(ship1Loc);
    ships.push(ship1);

    var ort2 = getOrientation();
    var ship2Loc;
     do {
        ship2Loc = getShipLocation(ort2);
    }while (ship2Loc == COLLISION_FOUND);

    console.log(ship2Loc);
    var ship2 = new ship(ship2Loc);
    ships.push(ship2);

    var ort3 = getOrientation();
    var ship3Loc;
    do {
        ship3Loc = getShipLocation(ort3);
    }while (ship3Loc == COLLISION_FOUND);

    console.log(ship3Loc);
    var ship3 = new ship(ship3Loc);
    ships.push(ship3);

    return ships;
}

function ship(locations) {
    this.locations = locations;
    this.hits = ["", "", ""];
}

function getOrientation() {
    var availableOrientation = [0, 1];
    var index = Math.floor(Math.random() * availableOrientation.length);
    return availableOrientation[index];
}

function getRandomIndexInAnArray(array) {
    var index = Math.floor(Math.random() * array.length);
    if (index > 4) {
        index = 4;
    }
    return index;
}