//Array for different categories
const categories = {
    fruits: ["./images/fruit1.jpeg", "./images/fruit2.jpeg", "./images/fruit3.jpeg", "./images/fruit4.jpeg", "./images/fruit5.jpeg", "./images/fruit6.jpeg", "./images/fruit7.jpeg", "./images/fruit8.jpeg"],
    emojis: ["./images/Emoji1.jpeg", "./images/Emoji2.jpg", "./images/Emoji3.jpeg", "./images/Emoji4.jpeg", "./images/Emoji5.jpg", "./images/Emoji6.png", "./images/Emoji7.jpg", "./images/Emoji8.jpg"],
    animals: ["./images/Animal1.jpeg", "./images/Animal2.jpeg", "./images/Animal3.jpg", "./images/Animal4.jpeg", "./images/Animal5.jpeg", "./images/Animal6.jpeg", "./images/Animal7.jpeg", "./images/Animal8.avif"],
    planets: ["./images/Planet1.jpg", "./images/Planet2.png", "./images/Planet3.png", "./images/Planet4.png", "./images/Planet5.png", "./images/Planet6.png", "./images/Planet7.png", "./images/Planet8.png"],
    flags: ["./images/Flag1.jpg", "./images/Flag2.jpg", "./images/Flag3.jpeg", "./images/Flag4.jpeg", "./images/Flag5.png", "./images/Flag6.jpg", "./images/Flag7.png", "./images/Flag8.jpeg"],
    landMarks: ["./images/Mark1.jpeg", "./images/Mark2.jpg", "./images/Mark3.jpeg", "./images/Mark4.jpeg", "./images/Mark5.jpeg", "./images/Mark6.jpeg", "./images/Mark7.jpeg", "./images/Mark8.jpg"],
    shapes: ["./images/Shape1.png", "./images/Shape2.jpeg", "./images/Shape3.png", "./images/Shape4.jpeg", "./images/Shape5.jpeg", "./images/Shape6.jpeg", "./images/Shape7.png", "./images/Shape8.jpg"],
    vegetables: ["./images/veg1.jpeg", "./images/veg2.jpeg", "./images/veg3.jpeg", "./images/veg4.jpeg", "./images/veg5.jpeg", "./images/veg6.jpeg", "./images/veg7.jpeg", "./images/veg8.jpeg"],
    pokemons: ["./images/Poke1.jpeg", "./images/Poke2.png", "./images/Poke3.jpg", "./images/Poke4.jpg", "./images/Poke5.png", "./images/Poke6.png", "./images/Poke7.jpg", "./images/Poke8.jpeg"],
    cartoons: ["./images/Cartoon1.png", "./images/Cartoon2.jpeg", "./images/Cartoon3.jpeg", "./images/Cartoon4.jpeg", "./images/Cartoon5.jpeg", "./images/Cartoon6.jpeg", "./images/Cartoon7.png", "./images/Cartoon8.jpeg"],
    foods: ["./images/Food1.jpeg", "./images/Food2.jpeg", "./images/Food3.jpeg", "./images/Food4.jpeg", "./images/Food5.jpeg", "./images/Food6.jpeg", "./images/Food7.jpeg", "./images/Food8.jpeg"],
    harry: ["./images/Harry1.jpeg", "./images/Harry2.jpeg", "./images/Harry3.jpeg", "./images/Harry4.jpeg", "./images/Harry5.jpeg", "./images/Harry6.jpeg", "./images/Harry7.png", "./images/Harry8.jpeg"],
    flowers: ["./images/Flower1.jpeg", "./images/Flower2.jpeg", "./images/Flower3.jpeg", "./images/Flower4.jpeg", "./images/Flower5.jpeg", "./images/Flower6.jpeg", "./images/Flower7.jpeg", "./images/Flower8.jpeg"],
    memes: ["./images/Meme1.jpeg", "./images/Meme2.jpeg", "./images/Meme3.jpeg", "./images/Meme4.jpeg", "./images/Meme5.png", "./images/Meme6.png", "./images/Meme7.jpeg", "./images/Meme8.jpeg"],
    sweets: ["./images/Dessert1.jpeg", "./images/Dessert2.jpeg", "./images/Dessert3.jpeg", "./images/Dessert4.jpeg", "./images/Dessert5.jpeg", "./images/Dessert6.jpeg", "./images/Dessert7.jpeg", "./images/Dessert8.jpeg"],
};

let firstCard, secondCard;
let lockBoard = false;
let timeLeft = 30;
let timer;
let score = 0;
let cards = [];
let gameActive = false;
let currentSound = null;

// Sounds Path
const flipSound = new Audio('./Sounds/Flip.wav');
const matchSound = new Audio('./Sounds/Match.wav');
const unmatchSound = new Audio('./Sounds/Wrong.wav');

// On Click of start button on banner it takes to categories section
function showGrid() {
    document.getElementById("category-selection").scrollIntoView({ behavior: "smooth" });
}

function navigateToGame(category) {
    window.location.href = `./Game.html?category=${category}`;
}

// Get the category from the URL when Game.html loads
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");  

    if (category) {
        startGame(category); // Start the game with the selected category
    } else {
        console.error("No category found in the URL!");
    }
});


// Game Starts
function startGame(category) {
    cards = [...categories[category], ...categories[category]];
    createBoard();

    // Enable the start button
    const startButton = document.getElementById("startButton");
    startButton.disabled = false;
    startButton.addEventListener("click", () => {
        startTimer();
        gameActive = true;
        startButton.disabled = true;
    });
}

//  Randomly rearrange the elements of an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// generating the game board by creating card in that
function createBoard() {
    shuffle(cards);
    const board = document.getElementById("game-board");
    board.innerHTML = "";
    cards.forEach(image => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.image = image;
        card.innerHTML = `<img src="${image}" alt="">`;
        card.addEventListener("click", flipCard);
        board.appendChild(card);
    });
}

// flipping card
function flipCard() {
    if (!gameActive || lockBoard || this === firstCard) return;

    // Play the flip sound effect
    flipSound.currentTime = 0; 
    flipSound.play();

    this.classList.add("flipped");
    if (!firstCard) {
        firstCard = this;
        return;
    }
    secondCard = this;
    lockBoard = true;
    checkMatch();
    saveGameState();
}

// Checking matched or not 
function checkMatch() {
    let isMatch = firstCard.dataset.image === secondCard.dataset.image;
    if (isMatch) {
        matchSound.currentTime = 0; 
        matchSound.play(); 
        
        // Add a class to give style for matched cards
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        
        disableCards();
        score += 10; // score increment
        document.getElementById("totalScore").innerText = score;
    } else {
        unmatchSound.currentTime = 0; 
        unmatchSound.play();
        unflipCards();
    }
    checkWin();
}

// disable of cards when they matched so unable to click on it
function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    resetBoard();
}

// when the two selected cards do not match then unflip them
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
    }, 1000);
}

// Reseting the game after each round
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}


// For the countdown of game
function startTimer() {
    if (timer) clearInterval(timer); // Clear the previous timer, if any

    // Use the existing timeLeft if it is already set
    if (typeof timeLeft === "undefined" || timeLeft === null) {
        timeLeft = 30; // Default 
    }

    document.getElementById("time-left").innerText = timeLeft;

    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById("time-left").innerText = timeLeft;
            saveGameState(); // Save the remaining time
        } else {
            clearInterval(timer); 
            gameActive = false; 
            showEndGamePopup(false); 
        }
    }, 1000);
}

// Checking all pairs matched 
function checkWin() {
    if (document.querySelectorAll(".flipped").length === cards.length) {
        clearInterval(timer);
        gameActive = false;
        setTimeout(() => showEndGamePopup(true), 500); // Game won
    }
}

// Showing the message of win or lose
function showEndGamePopup(isWin) {
    const popup = document.getElementById("endGamePopup");
    const message = isWin ? "Congratulations! You won!" : "Time's up! You lost.";
    const scoreMessage = `Your final score is : ${score}`;

    document.getElementById("popupMessage").innerText = message;
    document.getElementById("popupScore").innerText = scoreMessage;


    // Image in popup box 
    const image = document.getElementById("popupImage");
    image.src = isWin ? "./Images/WinPop.gif" : "./Images/Lose.gif"; 
    image.alt = isWin ? "Winning Sticker" : "Losing Sticker";

    if (currentSound) {
        currentSound.pause();
        currentSound.currentTime = 0;
    }

    currentSound = isWin ? new Audio('./Sounds/Win.wav') : new Audio('./Sounds/Game Lose.wav');
    currentSound.play();

    popup.style.display = "block";
    
     // Clear saved game state from local storage
     localStorage.removeItem("memoryGameState");
}


// After clicking close button in popup
function closePopup() {
    const popup = document.getElementById("endGamePopup");
    popup.style.display = "none";

    if (currentSound) {
        currentSound.pause();
        currentSound.currentTime = 0;
    }
    console.log("Close button clicked!");
    // Clear the previous game and reset the game 
    document.getElementById("game-board").innerHTML = ""; 
    score = 0; 
    document.getElementById("totalScore").innerText = score;
    clearInterval(timer); 
    timeLeft = 30; 
    document.getElementById("time-left").innerText = timeLeft;
    gameActive = false;

    // Restart the game with the same category
    const selectedCategory = Object.keys(categories).find(category =>
        categories[category].some(image => cards.includes(image))
    );

    if (selectedCategory) {
        startGame(selectedCategory); 
    }
}




// Saving on localstorage and then retrieving it
function saveGameState() {
    const gameState = {
        cards,
        flippedCards: [...document.querySelectorAll('.card.flipped')].map(card => card.dataset.image),
        matchedCards: [...document.querySelectorAll('.card.matched')].map(card => card.dataset.image),
        timeLeft,
        score,
    };
    localStorage.setItem('memoryGameState', JSON.stringify(gameState));
}

// Load the saved game state from localStorage
function loadGameState() {
    const savedState = JSON.parse(localStorage.getItem("memoryGameState"));
    if (!savedState) return;

    // Restore game state
    cards = savedState.cards;
    timeLeft = savedState.timeLeft;
    score = savedState.score;

    // Rebuild the game board
    const board = document.getElementById("game-board");
    board.innerHTML = ""; // Clear the board
    cards.forEach(image => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.image = image;

        // Restore flipped and matched states
        if (savedState.flippedCards.includes(image)) {
            card.classList.add("flipped");
        }
        if (savedState.matchedCards.includes(image)) {
            card.classList.add("matched");
        }
        card.innerHTML = `<img src="${image}" alt="">`;
        card.addEventListener("click", flipCard);
        board.appendChild(card);
    });
    document.getElementById("time-left").innerText = timeLeft;
    document.getElementById("totalScore").innerText = score;
    startTimer();
    gameActive = true;
}



// Run on page loads
document.addEventListener("DOMContentLoaded", () => {
    const gameState = localStorage.getItem("memoryGameState");

    // Check the current page ....I have written separte logic for both pages for restoring game
    const currentPage = window.location.pathname;

    if (currentPage.includes("MemoryGame.html")) {
        // Logic for MemoryGame.html
        if (gameState && !localStorage.getItem("resuming")) {
            const resume = confirm("Do you want to resume your previous game?");
            if (resume) {
                const savedState = JSON.parse(gameState);
                const selectedCategory = Object.keys(categories).find(category =>
                    categories[category].some(image => savedState.cards.includes(image))
                );
                if (selectedCategory) {
                    localStorage.setItem("resuming", "true"); // Set the flag to prevent duplicate prompts
                    localStorage.setItem("redirecting", "true");
                    window.location.href = `./Game.html?category=${selectedCategory}`;
                } else {
                    console.error("Category for saved game not found.");
                }
            } else {
                localStorage.removeItem("memoryGameState");
                stopGame();
            }
        }
    } else if (currentPage.includes("Game.html")) {
        // Logic for Game.html
        if (localStorage.getItem("resuming")) {
            localStorage.removeItem("resuming");
            loadGameState(); 
        } else if (gameState) {
            const resume = confirm("Game exists. Do you want to resume it ?");
            if (resume) {
                loadGameState();
            } else {
                localStorage.removeItem("memoryGameState");
                const urlParams = new URLSearchParams(window.location.search);
                const category = urlParams.get("category");
                if (category) {
                    startGame(category); 
                } else {
                    console.error("No category found cannot start a new game.");
                }
            }
        }
    }
});
