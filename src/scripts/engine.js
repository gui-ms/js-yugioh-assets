const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards")
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
};

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: "./src/assets/icons/dragon.png",
        WinOf: [1],
        LoseTo: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: "./src/assets/icons/magician.png",
        WinOf: [2],
        LoseTo: [0],
    },
    {
        id: 2,
        name: "Exodia the Forbidden One",
        type: "scissors",
        img: "./src/assets/icons/exodia.png",
        WinOf: [0],
        LoseTo: [1],
    },
];


async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(cardId, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png" );
    cardImage.setAttribute("data-id", cardId );
    cardImage.classList.add("card");

    if(fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });

        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(cardId);
                });
    };

    
    return cardImage;
}

async function drawSelectCard(cardId){
    state.cardSprites.avatar.src = cardData[cardId].img;
    state.cardSprites.name.innerText = cardData[cardId].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[cardId].type;
}

async function setCardsField(cardId){
    await removeAllCardsImages();
    let computerCardId = await getRandomCardId();
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResult = await checkDuelResult(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResult);
}

async function checkDuelResult(cardId, computerCardId) {
    let duelResult = "Empate";
    let playerCard = cardData[cardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResult = "win";
        state.score.playerScore++;
    }

    if(playerCard.LoseTo.includes(computerCardId)) {
        duelResult = "lose";
        state.score.computerScore++;
    }

    await playAudio(duelResult);

    return duelResult;
}

async function drawButton(duelResult) {
    state.actions.button.innerText = duelResult.toUpperCase();
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";

    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudio(duelResult) {
    let audio = new Audio(`./src/assets/audios/${duelResult}.wav`);
    audio.volume = 0.2;
    audio.play();
    
}

async function removeAllCardsImages() {
    let {computerBox, player1Box} = state.playerSides;
    let imageElements = computerBox.querySelectorAll("img");
    imageElements.forEach((img) => img.remove());

    imageElements = player1Box.querySelectorAll("img");
    imageElements.forEach((img) => img.remove());
}

async function drawCards(cardNumber, fieldSide) {
    for (let index = 0; index < cardNumber; index++) {
        const randomCardId = await getRandomCardId();
        const cardImage = await createCardImage(randomCardId, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);   
    }
}

function init() {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    updateScore();
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.volume = 0.2;
    bgm.play();
}

init()