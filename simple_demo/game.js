// Store the total number of cards
var card = 6;
// Store the turn limits 
var turn = 0;
// Store the time limits
var mins = 0;
// Store the cards flipped correctly 
var success = 0;
// Store the total score: Success + 1, Fail - 1
var score = 0;
var result = null;

const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board')

};

const state = {
// Store the cards flipped in one turn
    flippedCards: 0,
// Store the number of turns 
    totalFlips: 0,
 // Store the total time used
    totalTime: 0,
    loop: null
};

// Initialize the values from home.html to game.html
function store_values(num_cards, num_turns, time_limit) {
    localStorage.setItem("card", num_cards);
    localStorage.setItem("turn", num_turns);
    localStorage.setItem("mins", time_limit);
    window.location.href = './game.html';
}

// Update the values as user input
function update_values() {
    card = parseInt(localStorage.getItem("card"));
    document.getElementById('cards').innerHTML = card;

    turn = parseInt(localStorage.getItem("turn"));
    document.getElementById('turns').innerHTML = turn;

    mins = parseInt(localStorage.getItem("mins")) * 60;
}

// Initailize the Game, Draw cards, shuffle, place the cards etc....
function generateGame() {
    if (card % 3 !== 0) {
        throw new Error("The number of cards must be a triple.");
    }
    const symbols = ['😂', '😌', '😒', '😢', '😑', '☺️', '🤤', '😈', '😴', '👻'];
    const picks = pickRandom(symbols, card / 3);
    const items = shuffle(picks);
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${card}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
       </div>
    `;

    const parser = new DOMParser().parseFromString(cards, 'text/html');
    selectors.board.replaceWith(parser.querySelector('.board'));
    state.loop = setInterval(() => {
        state.totalTime++;
        document.getElementById('success').innerHTML = success;
        document.getElementById('score-value').innerHTML = score;
        document.getElementById('turns').innerHTML = state.totalFlips;
        document.getElementById('time-limit').innerHTML = state.totalTime;
        if (((mins !== 0) && (state.totalTime > mins)) || ((turn !== 0) && (state.totalFlips > turn))) {
            result = 'fail';
            display_result(result);
        }
        if (success === card) {
            result = 'win';
            display_result(result);
        }
    }, 1000);
}

// Pick random cards
function pickRandom(symbols, choices) {
    const clonedArray = symbols;
    const randomPicks = [];

    for (let index = 0; index < choices; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length);
        randomPicks.push(clonedArray[randomIndex]);
        randomPicks.push(clonedArray[randomIndex]);
        randomPicks.push(clonedArray[randomIndex]);
        clonedArray.splice(randomIndex, 1);
    }

    return randomPicks;
}

// Shuffle the cards
function shuffle(array) {
    const clonedArray = array;
    shuffle_array = [];
    i = clonedArray.length;
    while (i--) {
        j = Math.floor(Math.random() * (i + 1));
        shuffle_array.push(clonedArray[j]);
        clonedArray.splice(j, 1);
    }
    return shuffle_array;
}

// Check the Click events
function attachEventListeners() {

    document.addEventListener('click', event => {
        const eventTarget = event.target;
        const eventParent = eventTarget.parentElement;
        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent);
        }
    });
}

function flipCard(card) {

    state.flippedCards++;

    if (state.flippedCards <= 3) {
        card.classList.add('flipped');
    }

// Check if the cards matched or not and count score
    if (state.flippedCards === 3) {
        state.totalFlips++;
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)');

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            if (flippedCards[0].innerText === flippedCards[2].innerText) {
                flippedCards[0].classList.add('matched');
                flippedCards[1].classList.add('matched');
                flippedCards[2].classList.add('matched');
                score++;
                success += 3;
            } else {
                score--;
            }
        } else {
            score--;
        }

        setTimeout(() => {
            flipBackCards();
        }, 1000);
    }
}
;

// Flip back the cards if incorrect
function flipBackCards() {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped');
    });

    state.flippedCards = 0;
}

function display_result(result) {
    if (result === 'fail') {
        next('You lose !');
    } else {
        next('Congratulations !');
    }
}

function next(result) {
    if (confirm(result)) {
        window.location.href = './index.html';
    } else {
        window.location.reload();
    }
}

(function () {
    update_values();
    generateGame();
    attachEventListeners();
})();
