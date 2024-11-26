document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.getElementById("game-container");
    const movesCounter = document.getElementById("moves");
    const matchesCounter = document.getElementById("matches");
    const restartButton = document.getElementById("restart-button");
    const nextLevelButton = document.getElementById("next-level-button");
    const timerDisplay = document.createElement("p");

    let moves = 0;
    let matches = 0;
    let flippedCards = [];
    let lockBoard = false;
    let timer;
    let currentLevel = 1;

    const levels = {
        1: {
            gridSize: 4,
            cardValues: [
                "🍎", "🍌", "🍇", "🍒",
                "🍎", "🍌", "🍇", "🍒",
                "🍋", "🍓", "🍉", "🍍",
                "🍋", "🍓", "🍉", "🍍"
            ]
        },
        2: {
            gridSize: 6,
            cardValues: [
                "🍎", "🍌", "🍇", "🍒", "🍋", "🍓",
                "🍉", "🍍", "🍑", "🥝", "🥭", "🍏",
                "🍎", "🍌", "🍇", "🍒", "🍋", "🍓",
                "🍉", "🍍", "🍑", "🥝", "🥭", "🍏",
                "🍊", "🍈", "🥥", "🥑", "🍒", "🍓",
                "🍊", "🍈", "🥥", "🥑", "🍒", "🍓"
            ]
        }
    };

    // Shuffle the cards
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Start the timer
    function startTimer() {
        let seconds = 0;
        timerDisplay.textContent = `Time: ${seconds} seconds`;
        timer = setInterval(() => {
            seconds++;
            timerDisplay.textContent = `Time: ${seconds} seconds`;
        }, 1000);
    }

    // Stop the timer
    function stopTimer() {
        clearInterval(timer);
    }

    // Initialize the game
    function initGame() {
        stopTimer();
        startTimer();
        const levelConfig = levels[currentLevel];
        moves = 0;
        matches = 0;
        flippedCards = [];
        lockBoard = false;

        movesCounter.textContent = moves;
        matchesCounter.textContent = matches;

        shuffle(levelConfig.cardValues);
        gameContainer.innerHTML = "";
        gameContainer.style.gridTemplateColumns = `repeat(${levelConfig.gridSize}, 100px)`;

        levelConfig.cardValues.forEach((value) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.value = value;

            card.addEventListener("click", () => flipCard(card));
            gameContainer.appendChild(card);
        });
    }

    // Flip a card
    function flipCard(card) {
        if (lockBoard || flippedCards.includes(card)) return;

        card.classList.add("flipped");
        card.textContent = card.dataset.value;
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }

    // Check if two flipped cards match
    function checkForMatch() {
        lockBoard = true;
        const [card1, card2] = flippedCards;

        if (card1.dataset.value === card2.dataset.value) {
            card1.classList.add("matched");
            card2.classList.add("matched");
            matches++;
            matchesCounter.textContent = matches;
            flippedCards = [];
            lockBoard = false;

            // Check if the level is won
            if (matches === levels[currentLevel].cardValues.length / 2) {
                stopTimer();
                if (currentLevel === 1) {
                    nextLevelButton.style.display = "block";
                } else {
                    setTimeout(() => alert("You won the game!"), 500);
                }
            }
        } else {
            setTimeout(() => {
                card1.classList.remove("flipped");
                card2.classList.remove("flipped");
                card1.textContent = "";
                card2.textContent = "";
                flippedCards = [];
                lockBoard = false;
            }, 1000);
        }

        moves++;
        movesCounter.textContent = moves;
    }

    // Event listeners
    restartButton.addEventListener("click", () => {
        currentLevel = 1;
        nextLevelButton.style.display = "none";
        initGame();
    });

    nextLevelButton.addEventListener("click", () => {
        currentLevel = 2;
        nextLevelButton.style.display = "none";
        initGame();
    });

    // Start the game
    document.body.insertBefore(timerDisplay, gameContainer);
    initGame();
});

