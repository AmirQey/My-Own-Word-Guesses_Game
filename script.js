// Variables declaration
// Store the win counts in local storage to avoid being reset to 0
let wins = Number(localStorage.getItem("wins"));
let answer;
let words = [];
let chance = 6;
let current_row = 0;
let over = false;

// Async Function to load the words from the .txt file
async function loadWords() {
    const response = await fetch("names.txt");
    const text = await response.text()

    // Convert into a list
    return text.split(",").map(function (w) { return w.trim().toLowerCase();}); 
}

// Async function that loads the words into the variable
async function startGame() {
    words = await loadWords();

    // Randomly pick an index number
    answer = words[Math.floor(Math.random() * words.length)];

    // Debug purposes, can uncomment 
    // const ans = document.getElementById("answer");
    // ans.textContent = answer;

    // build the boxes
    build(chance, answer.length);
}


// Function that validates each guesses [Main logic]
function score(guess, answer) {

    // blank = ["_"] * len_ans
    const blank = Array(answer.length).fill("_");

    // remaining = Counter()
    const remaining = {};

    // for i, j in enumerate(guess)
    for (let i = 0; i < guess.length; i++) {

        // if guess[i] = answer[i] :
            // blank[i] = j
        if (guess[i] === answer[i]) {
            blank[i] = answer[i]
        }

        // else:
            // remaining[answer[i]] += 1
        else {
            remaining[answer[i]] = (remaining[answer[i]] || 0) + 1 
            //when answer[i] is in remaining
                // it uses the stored value in remaining[answer[i]] and plus one
            // if answer[i] is not in remaining, remaining[answer[i]] is beasically 0 hence
                // it takes 0 and + 1
        }
    }

    // for i in range(len_ans)
    for (let i = 0; i < guess.length; i++) {

        // if blank[i] == "_"
        if (blank[i] === "_") {

            // if remaining[guess[i]] > 0 :
                // blank[i] = f"+{guess[i]}+"
                // remaining[guess[i]] -= 1
            if (remaining[guess[i]] > 0 ){
                blank[i] = `+${guess[i]}+`;
                remaining[guess[i]] -= 1;
            }

            // else:
                // blank[i] = f"-{guess[i]}-"
            else {
                blank[i] = `-${guess[i]}-`;
            }
        }
    }

    return blank;
}

// function that builds the grid layout
function build(rows, cols) {

    // the board id=board that has the grid
    const board = document.getElementById("board");

    // create rows
    for (let i = 0; i < rows; i++) {

        // the flex container
        const container = document.createElement("div");

        // will holds the .container css
        container.classList.add("container");

        // create boxes of each row
        for (let j=0; j < cols; j++) {

            // create div element for a box
            const box = document.createElement("div");

            // holds the .box css
            box.classList.add("box");
            box.textContent = "";

            // append it to the container
            container.appendChild(box);
        }

        // append container to the board
        board.appendChild(container);
    }
}

// Function that display the letter individually in box per row
function showGuess(row_index, guess) {

    // get the containers inside the board
    // so every_row has = 
    //                      [row1],
    //                      [row2],
    //                      [row3],
    //                      [row4],
    //                      [row5],
    //                      [row6]
    const every_row = document.getElementsByClassName("container");

    // get the boxes inside the container
    // so each_row has = [box1], [box2],...
    const each_row = every_row[row_index];
    for (let i = 0; i < guess.length; i++) {

        // .children means box, so .children[i].textContent = guess[i] means box-i put text guess-i
        each_row.children[i].textContent = guess[i];
    }

}

// Function that allows boxes to change color after guess
function colorGuess(row_index, guess, answer) {
    const blank = score(guess, answer);
    const every_row = document.getElementsByClassName("container");
    const each_row = every_row[row_index];

    // loop letter individually for the returned blank, e.g. word: +a+ p -p- -p- -l- +e+
    for (let i = 0; i < guess.length; i++) {

        // eg. +a+
        const current = blank[i];

        // every currents which has the + or - will enter this block
        if (current.length > 1) {
            if (current[0] === "+") {
                each_row.children[i].classList.add("present");
            }

            else if (current[0] === "-") {
                each_row.children[i].classList.add("wrong");
            }
        }

        // when the letter is right
        else if (current.length === 1) {
            each_row.children[i].classList.add("correct");
        }

        // css purposes
        each_row.children[i].classList.add("box-active");
        setTimeout(function () {
            each_row.children[i].classList.remove("box-active");
        }, 150);

    } 

    // pass to show guess to display the result in grid
    // important, because if do not pass, the guess will not be displayed and only the color effects get to display.
    showGuess(row_index, guess);
}

// Function that remove the open css from the popups classlist to remove the display.
function closePopup() {
    wrong_message.classList.remove("open");
    found_word.classList.remove("open");
    fail.classList.remove("open");
    word_input.focus();
}

// Function that check if the game is still run
function handleGuess(word) {
    if (!answer) {return;}
    if (!over) {
        current_row += submitGuess(word);

        // empty the text field
        word_input.value = "";
        word_input.focus();
    }
}

// Function that execute the doGuess()
function submitGuess(word) {
    const done = doGuess(word);

    // when the guesses are valid, it takes 1 chance, the one chance is used to allow current_row to know if it need to move to next index or stay
    if (done) { return 1;}

    // when error, return 0 to make sure its not counted
    return 0;
}

// Function to display error message in error popup because it has 3 different error message
function showError(text){
    const error = document.getElementById("error");
    error.textContent = text;
    wrong_message.classList.add("open");
}

// Function that used to validate the guesses entry
function doGuess(word) {
    
    // Errors checking
    if (word.length != answer.length) {
        showError("Error: word must equal to the boxes number");
        return false ;
    }

    if (!/^[a-z]+$/.test(word)) {
        showError("Error: use word only");
        return false ;
    }

    if (!words.includes(word)) {
        showError("Error: not a word in author's library");
        return false ;
    }

    // Valid guesses will be passed to colorGuess to display the text and boxes color
    colorGuess(current_row, word, answer);

    // Cases of game over when the answer is found or no more chance left
    if (word === answer) {
        // add 1 to win and save it to localStorage
        wins += 1;
        localStorage.setItem("wins", wins);

        // display the win popup
        const win_word = document.getElementById("win_word");
        win_word.textContent = `The answer is ${answer.toUpperCase()}`;
        found_word.classList.add("open");
        over = true;
    }

    else if (current_row === chance -1) {
        // display the fail popup
        const fail_word = document.getElementById("fail_word");
        fail_word.textContent = `The answer is ${answer.toUpperCase()}`;
        fail.classList.add("open");
        over = true;
    } 

    return true;
}

startGame();

// Popup message, button, text field variable declaration
const show_win_count = document.getElementById("win-count");
show_win_count.textContent = `Total Wins: ${wins} wins`;

const wrong_message = document.getElementById("error_message");
const found_word = document.getElementById("win_message");
const fail = document.getElementById("fail_message");

const button = document.getElementById("guessBtn");
const word_input = document.getElementById("guessInput");
word_input.focus();

// Click button and pass the word in text field to handelGuess
button.addEventListener("click", function() {
    const word = word_input.value.trim().toLowerCase();
    handleGuess(word);
});

// Press Enter key
word_input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {

        // if there are popup being displayed currently
        if (wrong_message.classList.contains("open")) {
            closePopup();
            return;
        }

        else if (found_word.classList.contains("open") || fail.classList.contains("open")) {
            location.reload();
        }

        // if no popup is displayed, pass the word in text field to handelGuess
        else {
            const word = word_input.value.trim().toLowerCase();
            handleGuess(word);
        }
    }

});