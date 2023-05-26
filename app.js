const player1Button = document.getElementById("Botaojogador1");
const player2Button = document.getElementById("Botaojogador2");
const resetButton = document.getElementById("BotaoReset");

const diceValue = document.getElementById("dice-value");
const playerValue = document.getElementById("player-value");
const roundWin = document.getElementById("player-round-win");

const gameTable = document.createElement("table");
gameTable.setAttribute("id", "game-table");
const tableBody = document.createElement("tbody");
const tableHeaderRow = document.createElement("tr");
const tableHeaderPlayer1 = document.createElement("th");
tableHeaderPlayer1.textContent = "Jogador 1";
const tableHeaderPlayer2 = document.createElement("th");
tableHeaderPlayer2.textContent = "Jogador 2";
const tableHeaderResult = document.createElement("th");
tableHeaderResult.textContent = "Resultado";
const tableHeaderRounds = document.createElement("th");
tableHeaderRounds.textContent = "Rounds";

tableHeaderRow.appendChild(tableHeaderRounds);
tableHeaderRow.appendChild(tableHeaderPlayer1);
tableHeaderRow.appendChild(tableHeaderPlayer2);
tableHeaderRow.appendChild(tableHeaderResult);
tableBody.appendChild(tableHeaderRow);
gameTable.appendChild(tableBody);
document.querySelector(".container").appendChild(gameTable);

let player1Moves = [];
let player2Moves = [];
let totalMoves = 0;
let totalRounds = 0;
let winners = [0, 0];

const storedData = localStorage.getItem("gameData");
if (storedData) {
  const parsedData = JSON.parse(storedData);
  player1Moves = parsedData.player1Moves;
  player2Moves = parsedData.player2Moves;
  totalMoves = parsedData.totalMoves;
  totalRounds = parsedData.totalRounds;
  winners = parsedData.winners;
}

player2Button.setAttribute("disabled", "");

function rollDice(maxValue) {
  return Math.floor(Math.random() * maxValue) + 1;
}

function getGameWinner(winners) {
  if (winners[0] > winners[1]) {
    return "Jogador 1";
  } else if (winners[1] > winners[0]) {
    return "Jogador 2";
  } else {
    return "NENHUM, houve um empate";
  }
}

function updateTable(rounds, player1Moves, player2Moves) {
  const tableRow = document.createElement("tr");
  const tableRound = document.createElement("th");
  tableRound.textContent = rounds;
  const tablePlayer1 = document.createElement("td");
  tablePlayer1.textContent = player1Moves[rounds - 1];
  const tablePlayer2 = document.createElement("td");
  tablePlayer2.textContent = player2Moves[rounds - 1];
  const tableResult = document.createElement("td");
  const roundWinner = determineRoundWinner(player1Moves, player2Moves, rounds - 1, winners);
  if (roundWinner === 1) {
    tableResult.textContent = "Jogador 1";
  } else if (roundWinner === 2) {
    tableResult.textContent = "Jogador 2";
  } else {
    tableResult.textContent = "Empate";
  }
  tableRow.appendChild(tableRound);
  tableRow.appendChild(tablePlayer1);
  tableRow.appendChild(tablePlayer2);
  tableRow.appendChild(tableResult);
  tableBody.appendChild(tableRow);
}

function determineRoundWinner(player1Moves, player2Moves, rounds, winners) {
  if (player1Moves[rounds] > player2Moves[rounds]) {
    winners[0]++;
    return 1;
  } else if (player2Moves[rounds] > player1Moves[rounds]) {
    winners[1]++;
    return 2;
  } else {
    return 3;
  }
}

function getCurrentPlayer(totalMoves) {
  let currentPlayer = totalMoves % 2;
  if (currentPlayer === 0) {
    player1Button.setAttribute("disabled", "");
    player2Button.removeAttribute("disabled");
    return "jogador 2";
  } else {
    player1Button.removeAttribute("disabled");
    player2Button.setAttribute("disabled", "");
    return "jogador 1";
  }
}

player1Button.addEventListener("click", () => {
  let result = rollDice(6);
  totalMoves++;
  let currentPlayer = getCurrentPlayer(totalMoves + 1);
  diceValue.textContent = result;
  playerValue.textContent = `Agora é a vez do ${currentPlayer}`;
  player1Moves.push(result);
  saveGameData();
});

player2Button.addEventListener("click", () => {
  let result = rollDice(6);
  totalMoves++;
  totalRounds++;
  let currentPlayer = getCurrentPlayer(totalMoves + 1);
  diceValue.textContent = result;
  playerValue.textContent = `É a vez do ${currentPlayer}`;
  player2Moves.push(result);
  if (determineRoundWinner(player1Moves, player2Moves, totalRounds - 1, winners) === 3) {
    roundWin.textContent = `O round ${totalRounds}º foi um empate!`;
  } else {
    roundWin.textContent = `O jogador ${determineRoundWinner(
      player1Moves,
      player2Moves,
      totalRounds - 1,
      winners
    )} ganhou o ${totalRounds}º round!`;
  }
  updateTable(totalRounds, player1Moves, player2Moves);
  if (totalRounds === 10) {
    resetButton.textContent = "Jogar novamente?";
    player1Button.setAttribute("disabled", "");
    player2Button.setAttribute("disabled", "");
    playerValue.textContent = `Fim de jogo! O campeão é: ${getGameWinner(winners)}`;
  }
  saveGameData();
});

resetButton.addEventListener("click", () => {
  localStorage.removeItem("gameData");
  location.reload(true);
});

function saveGameData() {
  const gameData = {
    player1Moves,
    player2Moves,
    totalMoves,
    totalRounds,
    winners,
  };
  localStorage.setItem("gameData", JSON.stringify(gameData));
}
