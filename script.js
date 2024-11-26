document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.getElementById("game-container");
    const movesCounter = document.getElementById("moves");
    const matchesCounter = document.getElementById("matches");

    // Define card values
    const cardValues = [
        "🍎", "🍌", "🍇", "🍒",
        "🍎", "🍌", "🍇", "🍒",
        "🍋", "🍓", "🍉", "🍍",
        "🍋", "🍓", "🍉", "🍍"
    ];

    let moves = 0;
    let matches = 0;
    let flippedCards = [];
    let lockBoard = false;

    // Shuffle the cards
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Initialize the game
    function initGame() {
        shuffle(cardValues);
        gameContainer.innerHTML = "";

        cardValues.forEach((value) => {
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

            // Check if the game is won
            if (matches === cardValues.length / 2) {
                setTimeout(() => alert("You won!"), 500);
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

    // Start the game
    initGame();
});
