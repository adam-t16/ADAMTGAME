document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.getElementById("game-container");
    const movesCounter = document.getElementById("moves");
    const matchesCounter = document.getElementById("matches");
    const nextLevelButton = document.createElement("button");

    let moves = 0;
    let matches = 0;
    let flippedCards = [];
    let lockBoard = false;

    // Définir les cartes pour chaque niveau
    const levels = [
        {
            cardValues: [
                "🍎", "🍌", "🍇", "🍒",
                "🍎", "🍌", "🍇", "🍒",
                "🍋", "🍓", "🍉", "🍍",
                "🍋", "🍓", "🍉", "🍍"
            ],
            gridTemplate: "repeat(4, 100px)" // Grille 4x4
        },
        {
            cardValues: [
                "🍎", "🍌", "🍇", "🍒", "🍋", "🍓",
                "🍎", "🍌", "🍇", "🍒", "🍋", "🍓",
                "🍉", "🍍", "🥝", "🍏", "🍉", "🍍",
                "🥝", "🍏", "🍑", "🍊", "🍑", "🍊"
            ],
            gridTemplate: "repeat(6, 100px)" // Grille 6x4
        }
    ];

    let currentLevel = 0;

    // Mélanger les cartes
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Initialiser le jeu
    function initGame(level) {
        moves = 0;
        matches = 0;
        flippedCards = [];
        lockBoard = false;

        movesCounter.textContent = moves;
        matchesCounter.textContent = matches;

        const { cardValues, gridTemplate } = levels[level];
        shuffle(cardValues);

        gameContainer.innerHTML = "";
        gameContainer.style.gridTemplateColumns = gridTemplate;

        cardValues.forEach((value) => {
            const card = document.createElement("div");
            card.classList.add("card");

            const cardFront = document.createElement("div");
            cardFront.classList.add("card-front");
            cardFront.textContent = value;

            const cardBack = document.createElement("div");
            cardBack.classList.add("card-back");
            cardBack.textContent = "❓";

            card.appendChild(cardFront);
            card.appendChild(cardBack);

            card.addEventListener("click", () => flipCard(card));
            gameContainer.appendChild(card);
        });

        if (level === levels.length - 1) {
            nextLevelButton.style.display = "none"; // Cacher le bouton après le dernier niveau
        }
    }

    // Retourner une carte
    function flipCard(card) {
        if (lockBoard || flippedCards.includes(card) || card.classList.contains("matched")) return;

        card.classList.add("flipped");
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }

    // Vérifier si deux cartes correspondent
    function checkForMatch() {
        lockBoard = true;
        const [card1, card2] = flippedCards;

        if (card1.querySelector(".card-front").textContent === card2.querySelector(".card-front").textContent) {
            card1.classList.add("matched");
            card2.classList.add("matched");
            matches++;
            matchesCounter.textContent = matches;
            flippedCards = [];
            lockBoard = false;

            if (matches === levels[currentLevel].cardValues.length / 2) {
                if (currentLevel < levels.length - 1) {
                    setTimeout(() => alert("Niveau terminé ! Passez au niveau suivant."), 500);
                    nextLevelButton.style.display = "block";
                } else {
                    setTimeout(() => alert("Bravo ! Vous avez terminé tous les niveaux !"), 500);
                }
            }
        } else {
            setTimeout(() => {
                card1.classList.remove("flipped");
                card2.classList.remove("flipped");
                flippedCards = [];
                lockBoard = false;
            }, 800); // Réduire le délai pour plus de difficulté
        }

        moves++;
        movesCounter.textContent = moves;
    }

    // Passer au niveau suivant
    nextLevelButton.textContent = "Niveau Suivant";
    nextLevelButton.style.display = "none";
    nextLevelButton.addEventListener("click", () => {
        currentLevel++;
        initGame(currentLevel);
    });

    document.body.appendChild(nextLevelButton);

    // Démarrer le jeu au premier niveau
    initGame(currentLevel);
});
