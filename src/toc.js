// board_1 for player vs player mode and board_2 for player vs computer mode
var board_1 = [],
    board_2 = [],
    win_squares = [];

// constants to determine win possibilities, user letter, ai OR user 2 letter and length of board
const win_combinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [6, 4, 2],
    [2, 5, 8],
    [1, 4, 7],
    [0, 3, 6]
];
const user = 'X',
    ai = 'O',
    LENGTH = 9;

// square_id to know which cell has been clicked and cur_player for current player
var square_id, cur_player = user;
// multiple scores to calculate the number of games won, lost, drawn by wihch user
var user_1_score = 0,
    user_2_score = 0,
    ai_score = 0,
    user_score = 0,
    tie_1_score = 0,
    tie_2_score = 0;
// mode to toggle between player vs player mode and player vs computer mode
var mode = -1,
    difficulty = 0,
    flag = false; // flag to stop game after win, lose or draw then start again if false


$(document).ready(function() {
    // initialize both boards
    start(2);

    // player vs player mode(0)
    $("#HUMAN").click(function() {
        $("#p1_score").text(user_1_score);
        $("#tie_score").text(tie_1_score);
        $("#p2_score").text(user_2_score);
        mode = 0;
        start(mode);
    });

    // player vs computer mode(1)
    $("#AI").click(function() {

        $("#p1_score").text(user_score);
        $("#tie_score").text(tie_2_score);
        $("#p2_score").text(ai_score);
        mode = 1;
        start(mode);
    });

    // actions when square is clicked
    $(".square").click(function() {
        // if the game ended, initialize the required board
        if (flag == true) start(mode);

        // if user doesn't choose any mode alert him
        if (mode != -1) {
            $(".alert-danger").hide();

            // get id of the square been clicked
            square_id = $(this).attr("id");

            // don't continue if the square clicked already has a value
            if (!mode && typeof board_1[square_id] == "number") // player vs player mode
                user_move(mode);
            else if (mode && typeof board_2[square_id] == "number") // player vs computer mode
                user_move(mode);
        } else {
            $(".alert-danger").show();
        }
    });
});

// change difficulty when select options change
function choose_diff() {
    difficulty = (difficulty == 0) ? 1 : 0;
}

// initialize according to the mode
function start(which_mode) {
    // hide all alerts
    $(".alert-primary").hide();
    $(".alert-dark").hide();
    $(".alert-warning").hide();
    $(".alert-danger").hide();

    // indication that the game hasn't ended and begin with user 'X'
    flag = false;
    cur_player = user;

    // initialize board by putting its index in it and remove text and color from corresponding square
    if (which_mode == 0) {
        for (let i = 0; i < LENGTH; i++) {
            board_1[i] = i;
            $("#" + i).text("");
            $("#" + i).css("background-color", "");
        }
    } else if (which_mode == 1) {
        for (let i = 0; i < LENGTH; i++) {
            board_2[i] = i;
            $("#" + i).text("");
            $("#" + i).css("background-color", "");
        }
    } else {
        for (let i = 0; i < LENGTH; i++) {
            board_1[i] = i;
            board_2[i] = i;
            $("#" + i).text("");
            $("#" + i).css("background-color", "");
        }
    }
}

// start of moves
function user_move(which_mode) {

    // if player vs player mode
    if (which_mode == 0) {
        // print current player letter and save it in board_1
        $("#" + square_id).text(cur_player);
        board_1[square_id] = cur_player;

        // check for win or lose and change color according
        let color;
        if (check_winner(board_1, cur_player)) {
            if (cur_player == user) {
                color = "green";
                user_1_score++; // increment player 1 score if win
                $("#p1_score").text(user_1_score);
            } else {
                color = "red";
                user_2_score++; // increment player 2 score if win
                $("#p2_score").text(user_2_score);
            }

            // change color of the win squares
            for (let i = 0; i < win_squares.length; i++) {
                $("#" + win_squares[i]).css('background-color', color);
            }

            // game ended
            flag = true;
            return;
        }

        // check for draw
        if (check_tie(board_1)) {
            // increase draw score
            tie_1_score++;
            $("#tie_score").text(tie_1_score);

            // change color of all squares
            for (let i = 0; i < LENGTH; i++) {
                $("#" + i).css('background-color', 'yellow');
            }

            // show the draw alert
            $(".alert-warning").show();
            flag = true;
            return;
        }

        // change player
        cur_player = (cur_player == user) ? ai : user;
    }

    // player vs computer mode(1)
    else {
        // print current player letter and save it in board_2
        $("#" + square_id).text(cur_player);
        board_2[square_id] = cur_player;

        // check for win or lose and change color according
        let color;
        if (check_winner(board_2, cur_player)) {
            if (cur_player == user) {
                user_score++; // increment user score if win
                $("#p1_score").text(user_score);
                color = "green";
            } else {
                ai_score++; // increment ai score if win
                $("#p2_score").text(ai_score);
                color = "red";
            }

            // change color of the win squares
            for (let i = 0; i < win_squares.length; i++) {
                $("#" + win_squares[i]).css('background-color', color);
            }

            // show alert if user wins or loses
            cur_player == user ? $(".alert-primary").show() : $(".alert-dark").show();
            flag = true;
            return;
        }

        // check for draw
        if (check_tie(board_2)) {
            // increase draw score
            tie_2_score++;
            $("#tie_score").text(tie_2_score);

            // change color of all squares
            for (let i = 0; i < LENGTH; i++) {
                $("#" + i).css('background-color', 'yellow');
            }

            // show the draw alert
            $(".alert-warning").show();
            flag = true;
            return;
        }
        ai_move();
    }
}

// computer move
function ai_move() {
    cur_player = ai; // change current player to ai

    // get the square id according to randomization(medium) or minimax algorithm(impossible)
    if (difficulty) {

        // copy the board and pass it to the function so it doesn't affect the main one
        var func_board = board_2.slice(0);
        square_id = minimax(func_board, ai).index;
    } else {

        // randomize til find a suitable square
        do {
            square_id = Math.floor(Math.random() * 9);
        } while (typeof board_2[square_id] != "number");
    }

    // make the move and save it
    $("#" + square_id).text(cur_player);
    board_2[square_id] = cur_player;

    // check for win, lose and draw again
    if (check_winner(board_2, cur_player)) {
        let color;
        if (cur_player == user) {
            user_score++;
            $("#p1_score").text(user_score);
            color = "green";
        } else {
            ai_score++;
            $("#p2_score").text(ai_score);
            color = "red";
        }
        for (let i = 0; i < win_squares.length; i++) {
            $("#" + win_squares[i]).css('background-color', color);
        }
        cur_player == user ? $(".alert-primary").show() : $(".alert-dark").show();
        flag = true;
        return;
    }
    if (check_tie(board_2)) {
        tie_2_score++;
        $("#tie_score").text(tie_2_score);
        for (let i = 0; i < LENGTH; i++) {
            $("#" + i).css('background-color', 'yellow');
        }
        $(".alert-warning").show();
        flag = true;
        return;
    }
    cur_player = user;
}

// check if player is the winner by looping through all winning possibilities and save the correct one if exists
function check_winner(board, player) {
    for (let i = 0; i < win_combinations.length; i++) {
        if (board[win_combinations[i][0]] == board[win_combinations[i][1]] && board[win_combinations[i][1]] == board[
                win_combinations[i][2]] && board[win_combinations[i][2]] == player) {
            win_squares = [win_combinations[i][0], win_combinations[i][1], win_combinations[i][2]];
            return true;
        }
    }
    return false;
}

// check for draw if there is any available squares
function check_tie(board) {
    return empty_squares(board).length == 0;
}

// return board of empty squares
function empty_squares(board) {
    return board.filter(square => typeof square == 'number');
}

// minimax algorithm
function minimax(board, player) {
    // store available square
    var spaces = empty_squares(board);

    // check for win, lose, draw and give it a cost
    if (check_winner(board, ai)) {
        return { cost: 10 };
    } else if (check_winner(board, user)) {
        return { cost: -10 };
    } else if (spaces.length == 0) {
        return { cost: 0 };
    }

    // store all moves (their indexes and costs)
    var moves = [];

    // looping through all empty squares
    for (var i = 0; i < spaces.length; i++) {

        // save the index and cost of move
        var move = {};
        move.index = board[spaces[i]];
        board[spaces[i]] = player;

        // recursive call of the function and return best move
        if (player == ai)
            move.cost = minimax(board, user).cost;
        else if (player == user)
            move.cost = minimax(board, ai).cost;

        // if player is the ai and cost is 10 then it's the best move and return it
        // or player is the user and cost is -10 which is also the best move then return it
        board[spaces[i]] = move.index;
        if ((player == ai && move.cost == 10) || (player == user && move.cost == -10))
            return move;
        else
            moves.push(move);
    }

    // loop through all moves to find the best move with the best cost
    let best_move, best_cost;

    // maximize the cost if the player is ai
    if (player == ai) {
        best_cost = -100;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].cost > best_cost) {
    	        best_cost = moves[i].cost;
    	        best_move = i;
            }
        }
    }

    // minimize the cost if the player is user
    else {
        best_cost = 100;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].cost < best_cost) {
    		    best_cost = moves[i].cost;
    			best_move = i;
            }
        }
    }
    return moves[best_move];
}