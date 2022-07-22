main();

function main() {
  let GameBoard = (function () {
    let gameBoardArray = [];
    let openSpotsArray = ["", "", "", "", "", "", "", "", ""];

    //function to populate Array
    const populateBoard = function () {
      //populate array with cells of the board
      for (let i = 1; i <= 9; i++) {
        let currentCell = createCellObject();
        currentCell.setCellNumber(i);
        gameBoardArray.push(currentCell);
      }
    };

    const clearBoard = function () {
      gameBoardArray = [];
      for (let i = 1; i <= 9; i++) {
        let currentCell = createCellObject();
        currentCell.setCellNumber(i);
        gameBoardArray.push(currentCell);
      }
    };

    //factory function to create object to represent cell
    function createCellObject() {
      let cellNumber;
      let isFree = true;
      let markerPlaced;

      const setCellNumber = (num) => {
        cellNumber = num;
      };
      const setIsFreeToFalse = () => {
        isFree = false;
      };
      const setMarkerPlaced = (marker) => {
        markerPlaced = marker;
      };

      const checkIfCellFree = () => isFree;

      const getCellMarker = () => markerPlaced;

      const getCellNumber = () => cellNumber;

      return {
        setCellNumber,
        setIsFreeToFalse,
        setMarkerPlaced,
        checkIfCellFree,
        getCellMarker,
        getCellNumber,
      };
    }

    //factory function to set UI up
    const setUpDisplay = function (placeMarkerFunction, gamePlayObject) {
      let uiDisplay = createDisplay(placeMarkerFunction, gamePlayObject);
      uiDisplay.setUpButtons();
      let player1 = uiDisplay.player1;
      let player2 = uiDisplay.player2;
      // return
      return { player1, player2 };
    };

    //function to get array
    const getBoardArray = function () {
      return gameBoardArray;
    };

    //call populateBoard, setUpDisplay
    return {
      populateBoard,
      setUpDisplay,
      getBoardArray,
      clearBoard,
      openSpotsArray,
    };
  })();

  //module
  const gamePlay = (function () {
    let round = 0;

    let level;

    let computerRound = 0;

    //variable to keep track of if there are any winners
    let gameOver = false;

    //variable to keep track of who placed the last item
    let isX = true;

    const setLevel = (difficulty) => {
      level = difficulty;
    };
    const getLevel = () => level;

    //private method to check if legal move
    const isLegal = (cellNum) => {
      return GameBoard.getBoardArray()[cellNum - 1].checkIfCellFree();
    };

    function placeMarkerHelperFunction(
      originalCellNum,
      player1,
      player2,
      isComputer
    ) {
      let cellNum = Array.from(originalCellNum);
      let player1ScoreUI = document.getElementById("player1Score");
      let player2ScoreUI =
        document.getElementById("player2Score") == null
          ? document.getElementById("computerScore")
          : document.getElementById("player2Score");

      cellNum = cellNum[4];

      if (isLegal(cellNum) == true) {
        GameBoard.getBoardArray()[cellNum - 1].setIsFreeToFalse();
        let marker = isX ? "X" : "O";
        GameBoard.getBoardArray()[cellNum - 1].setMarkerPlaced(marker);
        if (isX && isComputer) {
          GameBoard.openSpotsArray[cellNum - 1] = "X";
        } else if (!isX && isComputer) {
          GameBoard.openSpotsArray[cellNum - 1] = "O";
        }

        if (isX) {
          player1ScoreUI.firstChild.style.color = "rgba(94, 90, 90, 0.6)";
          player1ScoreUI.lastChild.style.color = "rgba(94, 90, 90, 0.6)";
          player2ScoreUI.firstChild.style.color = "blue";
          player2ScoreUI.lastChild.style.color = "blue";

          //add x onto board
          let currentUICell = document.getElementById(originalCellNum);
          let xImage = document.createElement("img");
          xImage.src = "images/x.png";
          currentUICell.appendChild(xImage);
          round++;
        } else {
          player1ScoreUI.firstChild.style.color = "red";
          player1ScoreUI.lastChild.style.color = "red";
          player2ScoreUI.firstChild.style.color = "rgba(94, 90, 90, 0.6)";
          player2ScoreUI.lastChild.style.color = "rgba(94, 90, 90, 0.6)";

          //add O onto board
          let currentUICell = document.getElementById(originalCellNum);
          let oImage = document.createElement("img");
          oImage.src = "images/circle.png";
          currentUICell.appendChild(oImage);
          computerRound++;
        }

        isX = !isX;

        if (round > 2) {
          let winInfo = checkIfGameOver(cellNum);

          //update winner object and UI
          if (gameOver == true) {
            //increase score
            if (!isX) {
              //x is the winner
              player1.increaseScore();
              player1ScoreUI.lastChild.textContent = player1.getNumWins();
            } else {
              player2.increaseScore();
              player2ScoreUI.lastChild.textContent = player2.getNumWins();
            }

            //display a element congratuating user for winning and the row, column, or diagonal in which the user won
            if (winInfo.getRow() != 0) {
              if (winInfo.getRow() == 1) {
                rowWinner(1);
              } else if (winInfo.getRow() == 2) {
                rowWinner(4);
              } else {
                rowWinner(7);
              }
            } else if (winInfo.getCol() != 0) {
              if (winInfo.getCol() == 1) {
                columnWinner(1);
              } else if (winInfo.getCol() == 2) {
                columnWinner(2);
              } else {
                columnWinner(3);
              }
            } else if (winInfo.getDiagonal() != 0) {
              if (winInfo.getDiagonal() == 1) {
                diagonal1Winner(1);
              } else {
                diagonal2Winner(3);
              }
            }

            for (let i = 0; i < 9; i++) {
              GameBoard.openSpotsArray[i] = "";
            }

            player1ScoreUI.firstChild.style.color = "red";
            player1ScoreUI.lastChild.style.color = "red";
            player2ScoreUI.firstChild.style.color = "rgba(94, 90, 90, 0.6)";
            player2ScoreUI.lastChild.style.color = "rgba(94, 90, 90, 0.6)";

            displayWinner(isX, player1, player2, false, isComputer);
            isX = true;
            computerRound = 0;

            GameBoard.clearBoard();
          } else if (checkTie() == true) {
            //update tie score UI and object
            let tieUI = document.getElementById("tie");
            tieUI.lastChild.textContent =
              parseInt(tieUI.lastChild.textContent) + 1;

            player1ScoreUI.firstChild.style.color = "red";
            player1ScoreUI.lastChild.style.color = "red";
            player2ScoreUI.firstChild.style.color = "rgba(94, 90, 90, 0.6)";
            player2ScoreUI.lastChild.style.color = "rgba(94, 90, 90, 0.6)";

            computerRound = 0;

            //clear array
            displayWinner(isX, player1, player2, true, isComputer);

            isX = true;

            GameBoard.clearBoard();
            for (let i = 0; i < 9; i++) {
              GameBoard.openSpotsArray[i] = "";
            }
          }
        }
        return true;
      } else {
        return false;
      }
    }

    const placeMarker = (originalCellNum, player1, player2, isComputer) => {
      if (isComputer) {
        let player1ScoreUI = document.getElementById("player1Score");
        let player2ScoreUI = document.getElementById("computerScore");

        if (round == 0) {
          player1ScoreUI.firstChild.style.color = "red";
          player1ScoreUI.lastChild.style.color = "red";
          player2ScoreUI.firstChild.style.color = "blue";
          player2ScoreUI.lastChild.style.color = "blue";
        }

        console.log(gameOver);

        if (
          player1ScoreUI.firstChild.style.color == "red" &&
          checkArrayFull(GameBoard.openSpotsArray) == null
        ) {
          placeMarkerHelperFunction(
            originalCellNum,
            player1,
            player2,
            isComputer
          );
        }

        if (
          gameOver == false &&
          player2ScoreUI.firstChild.style.color == "blue"
        ) {
          if (level == "Easy") {
            //randomized placement
            generateRandomMarker(player1, player2, isComputer);
          } else if (level == "Medium") {
            //randomize 4 rounds then play
            if (computerRound < 2) {
              generateRandomMarker(player1, player2, isComputer);
            } else {
              //call function to set up minimax
              callMinimaxAlgorithm(player1, player2, isComputer);
            }
          } else if (level == "Hard") {
            //randomiz 2 rounds (use % to calculate current round) then play
            if (computerRound < 1) {
              generateRandomMarker(player1, player2, isComputer);
            } else {
              //call function to set up minimax
              callMinimaxAlgorithm(player1, player2, isComputer);
            }
          } else if (level == "Unbeatable") {
            //call function to set up minimax
            callMinimaxAlgorithm(player1, player2, isComputer);
          }
        }

        console.log(GameBoard.openSpotsArray);
      } else {
        placeMarkerHelperFunction(
          originalCellNum,
          player1,
          player2,
          isComputer
        );
      }
    };

    function generateRandomMarker(player1, player2, isComputer) {
      setTimeout(() => {
        let randomNumber = Math.round(Math.random() * 8) + 1;

        randomNumber = "cell" + randomNumber;
        let newMarker = placeMarkerHelperFunction(
          randomNumber,
          player1,
          player2,
          isComputer
        );

        while (newMarker == false) {
          randomNumber = Math.round(Math.random() * 8) + 1;
          randomNumber = "cell" + randomNumber;
          newMarker = placeMarkerHelperFunction(
            randomNumber,
            player1,
            player2,
            isComputer
          );
        }
      }, 500);
    }

    function callMinimaxAlgorithm(player1, player2, isComputer) {
      //setTimer function for certain amount of seconds, so that the computers response doesnt seem simultaneous
      setTimeout(() => {
        //set up code to execute minimax function
        let bestScore = -Infinity;
        let bestMove;
        for (let i = 0; i < 9; i++) {
          if (GameBoard.openSpotsArray[i] == "") {
            GameBoard.openSpotsArray[i] = "O";
            let score = minimax(GameBoard.openSpotsArray, 0, false);
            if (score > bestScore) {
              bestScore = score;
              bestMove = i;
            }
            GameBoard.openSpotsArray[i] = "";
          }
        }

        GameBoard.openSpotsArray[bestMove] = "O";
        bestMove += 1;
        bestMove = "cell" + bestMove;

        //use bestMove
        placeMarkerHelperFunction(bestMove, player1, player2, isComputer);

        //add event listener back
      }, 500);
    }

    let scoreTable = {
      X: -10,
      O: 10,
      tie: 0,
    };

    function minimax(array, depth, isMaximizing) {
      //base case
      let scores = checkArrayFull(array);
      if (scores != null) {
        return scoreTable[scores];
      } else {
        //Computers turn
        if (isMaximizing) {
          let bestScore = -Infinity;
          for (let i = 0; i < 9; i++) {
            if (array[i] == "") {
              array[i] = "O";
              let score = minimax(array, depth + 1, false) - depth;
              bestScore = Math.max(score, bestScore);
              GameBoard.openSpotsArray[i] = "";
            }
          }
          return bestScore;
        } else {
          //users turn
          let bestScore = Infinity;
          for (let i = 0; i < 9; i++) {
            if (array[i] == "") {
              array[i] = "X";
              let score = minimax(array, depth + 1, true) + depth;
              bestScore = Math.min(score, bestScore);
              GameBoard.openSpotsArray[i] = "";
            }
          }
          return bestScore;
        }
      }
    }

    //check if array is filled
    function checkArrayFull(array) {
      //base case
      let counter = 0;
      for (let i = 0; i < 9; i++) {
        if (array[i] != "") {
          counter++;
        }
      }

      if (counter == 9) {
        if (
          (array[0] == array[1] && array[0] == array[2]) ||
          (array[0] == array[3] && array[0] == array[6]) ||
          (array[0] == array[4] && array[0] == array[8])
        ) {
          return array[0];
        } else if (array[1] == array[4] && array[1] == array[7]) {
          return array[1];
        } else if (
          (array[2] == array[5] && array[2] == array[8]) ||
          (array[2] == array[4] && array[2] == array[6])
        ) {
          return array[2];
        } else if (array[3] == array[4] && array[3] == array[5]) {
          return array[3];
        } else if (array[6] == array[7] && array[6] == array[8]) {
          return array[6];
        } else {
          return "tie";
        }
      }
      return null;
    }

    function rowWinner(startingCell) {
      for (let i = startingCell; i <= startingCell + 2; i++) {
        changeCellBackgroundColor(i);
      }
    }

    function columnWinner(startingCell) {
      for (let i = startingCell; i <= startingCell + 6; i += 3) {
        changeCellBackgroundColor(i);
      }
    }

    function diagonal1Winner(startingCell) {
      for (let i = startingCell; i <= 9; i += 4) {
        changeCellBackgroundColor(i);
      }
    }

    function diagonal2Winner(startingCell) {
      for (let i = startingCell; i <= 7; i += 2) {
        changeCellBackgroundColor(i);
      }
    }

    function changeCellBackgroundColor(cellNumber) {
      const currCellNumberId = "cell" + cellNumber;
      let currCell = document.getElementById(currCellNumberId);
      currCell.classList.add("winner");
    }

    function displayWinner(isX, player1, player2, tie, isComputer) {
      let keepPlaying = false;
      //shade background
      let shadedBackground = document.createElement("div");
      shadedBackground.id = "darkenScreen";
      let body = document.querySelector("body");
      body.appendChild(shadedBackground);

      //add modal
      let modal = document.createElement("div");
      modal.classList.add("playAgainModal");

      let winner;
      let tieUI;

      if (tie == true) {
        tieUI = document.createElement("h1");
        tieUI.textContent = "Tie";
        tieUI.classList.add("tieText");
        body.appendChild(tieUI);
      } else {
        winner = document.createElement("h1");
        winner.textContent = "Winner: ";
        winner.textContent +=
          isX == false ? player1.getName() : player2.getName();
        winner.classList.add("winnerText");
        body.appendChild(winner);
      }

      //play again text
      let playAgainText = document.createElement("h2");
      playAgainText.textContent = "Play Again?";

      let playOptionsDiv = document.createElement("div");
      playOptionsDiv.classList.add("playOptions");

      let p1Yes = false;
      let p2Yes = false;

      //Player 1
      let player1Options = document.createElement("div");
      let player1OptionsName = document.createElement("h4");
      player1OptionsName.textContent = player1.getName();
      let player1PlayAgainButton = document.createElement("button");
      player1PlayAgainButton.textContent = "Yes";
      player1PlayAgainButton.addEventListener("click", () => {
        if (isComputer) {
          body.removeChild(modal);
          //remove background
          body.removeChild(shadedBackground);

          //remove winner text
          if (tie == true) {
            body.removeChild(tieUI);
          } else {
            body.removeChild(winner);
          }

          //return true -> which will mean to clear the screen and keep scores
          keepPlaying = true;
          gameOver = false;

          for (let i = 1; i <= 9; i++) {
            let currCellId = "cell" + i;
            let cell = document.getElementById(currCellId);

            cell.classList.remove("winner");
            cell.textContent = "";
          }
        } else {
          if (p2Yes == true) {
            //remove modal
            body.removeChild(modal);
            //remove background
            body.removeChild(shadedBackground);

            //remove winner text
            if (tie == true) {
              body.removeChild(tieUI);
            } else {
              body.removeChild(winner);
            }

            //return true -> which will mean to clear the screen and keep scores
            keepPlaying = true;
            gameOver = false;

            for (let i = 1; i <= 9; i++) {
              let currCellId = "cell" + i;
              let cell = document.getElementById(currCellId);

              cell.classList.remove("winner");
              cell.textContent = "";
            }
          } else {
            p1Yes = true;
            player1PlayAgainButton.style.backgroundColor = "green";
          }
        }
      });
      player1PlayAgainButton.classList.add("playButtons");
      let player1StopPlayingButton = document.createElement("button");
      player1StopPlayingButton.addEventListener("click", () => {
        window.location.reload();
      });
      player1StopPlayingButton.textContent = "No";
      player1StopPlayingButton.classList.add("playButtons");

      player1Options.appendChild(player1OptionsName);
      player1Options.appendChild(player1PlayAgainButton);
      player1Options.appendChild(player1StopPlayingButton);
      player1Options.classList.add("playerOptions");
      playOptionsDiv.appendChild(player1Options);

      if (!isComputer) {
        //Player 2
        let player2Options = document.createElement("div");
        let player2OptionsName = document.createElement("h4");
        player2OptionsName.textContent = player2.getName();
        let player2PlayAgainButton = document.createElement("button");
        player2PlayAgainButton.textContent = "Yes";
        player2PlayAgainButton.addEventListener("click", () => {
          if (p1Yes == true) {
            //remove modal
            body.removeChild(modal);
            //remove background
            body.removeChild(shadedBackground);

            //remove winner text
            if (tie == true) {
              body.removeChild(tieUI);
            } else {
              body.removeChild(winner);
            }

            //return true -> which will mean to clear the screen and keep scores
            keepPlaying = true;

            gameOver = false;

            for (let i = 1; i <= 9; i++) {
              let currCellId = "cell" + i;
              let cell = document.getElementById(currCellId);
              cell.classList.remove("winner");
              cell.textContent = "";
            }
          } else {
            p2Yes = true;
            player2PlayAgainButton.style.backgroundColor = "green";
          }
        });
        player2PlayAgainButton.classList.add("playButtons");
        let player2StopPlayingButton = document.createElement("button");
        player2StopPlayingButton.addEventListener("click", () => {
          window.location.reload();
        });
        player2StopPlayingButton.classList.add("playButtons");

        player2StopPlayingButton.textContent = "No";
        player2Options.appendChild(player2OptionsName);
        player2Options.appendChild(player2PlayAgainButton);
        player2Options.appendChild(player2StopPlayingButton);
        player2Options.classList.add("playerOptions");
        playOptionsDiv.appendChild(player2Options);
      }

      modal.appendChild(playAgainText);
      modal.appendChild(playOptionsDiv);

      body.appendChild(modal);

      return keepPlaying;
    }

    function checkTie() {
      for (let i = 1; i <= 9; i++) {
        let currCellId = "cell" + i;
        let currCell = document.getElementById(currCellId);
        if (currCell.hasChildNodes() == false) {
          return false;
        }
      }

      return true;
    }

    function winningCellsInfo() {
      let row = 0;
      let column = 0;
      let diagonal = 0;

      const setRow = (winningRow) => {
        row = winningRow;
      };
      const setColumn = (winningCol) => {
        column = winningCol;
      };
      const setDiagonal = (winningDiagonal) => {
        diagonal = winningDiagonal;
      };

      const getRow = () => row;
      const getCol = () => column;
      const getDiagonal = () => diagonal;
      return { setRow, setColumn, setDiagonal, getRow, getCol, getDiagonal };
    }

    const checkIfGameOver = function (cellNum) {
      let arrayOfCells = GameBoard.getBoardArray();
      let winInfo = winningCellsInfo();
      if (cellNum == 1 || cellNum == 2 || cellNum == 3) {
        if (checkRow(1, arrayOfCells) == true) {
          //row win
          gameOver = true;
          winInfo.setRow(1);
          return winInfo;
        } else {
          if (cellNum == 1) {
            if (checkColumn(3, arrayOfCells) == true) {
              //column win
              gameOver = true;
              winInfo.setColumn(1);
              return winInfo;
            } else if (checkDiagonals(1, arrayOfCells) == true) {
              gameOver = true;
              winInfo.setDiagonal(1);
              return winInfo;
            }
          } else if (cellNum == 2) {
            if (checkColumn(4, arrayOfCells) == true) {
              //column win
              gameOver = true;
              winInfo.setColumn(2);
              return winInfo;
            }
          } else if (cellNum == 3) {
            if (checkColumn(5, arrayOfCells) == true) {
              //column win
              gameOver = true;
              winInfo.setColumn(3);
              return winInfo;
            } else if (checkDiagonals(3, arrayOfCells) == true) {
              gameOver = true;
              winInfo.setDiagonal(2);
              return winInfo;
            }
          }
        }
      } else if (cellNum == 4 || cellNum == 5 || cellNum == 6) {
        if (checkRow(4, arrayOfCells) == true) {
          //row win
          gameOver = true;
          winInfo.setRow(2);
          return winInfo;
        } else {
          if (cellNum == 4) {
            if (checkColumn(3, arrayOfCells)) {
              //column win
              gameOver = true;
              winInfo.setColumn(1);
              return winInfo;
            }
          } else if (cellNum == 5) {
            if (checkColumn(4, arrayOfCells) == true) {
              //column win
              gameOver = true;
              winInfo.setColumn(2);
              return winInfo;
            } else if (checkDiagonals(1, arrayOfCells) == true) {
              gameOver = true;
              winInfo.setDiagonal(1);
              return winInfo;
            } else if (checkDiagonals(3, arrayOfCells) == true) {
              gameOver = true;
              winInfo.setDiagonal(2);
              return winInfo;
            }
          } else if (cellNum == 6) {
            if (checkColumn(5, arrayOfCells) == true) {
              //column win
              gameOver = true;
              winInfo.setColumn(3);
              return winInfo;
            }
          }
        }
      } else if (cellNum == 7 || cellNum == 8 || cellNum == 9) {
        let winInfo = winningCellsInfo();
        if (checkRow(7, arrayOfCells) == true) {
          //row win
          gameOver = true;
          winInfo.setRow(3);
          return winInfo;
        } else {
          if (cellNum == 7) {
            if (checkColumn(3, arrayOfCells) == true) {
              //column win
              gameOver = true;
              winInfo.setColumn(1);
              return winInfo;
            } else if (checkDiagonals(3, arrayOfCells) == true) {
              gameOver = true;
              winInfo.setDiagonal(2);
              return winInfo;
            }
          } else if (cellNum == 8) {
            if (checkColumn(4, arrayOfCells) == true) {
              gameOver = true;
              winInfo.setColumn(2);
              return winInfo;
            }
          } else if (cellNum == 9) {
            if (checkColumn(5, arrayOfCells) == true) {
              gameOver = true;
              winInfo.setColumn(3);
              return winInfo;
            } else if (checkDiagonals(1, arrayOfCells) == true) {
              gameOver = true;
              winInfo.setDiagonal(1);
              return winInfo;
            }
          }
        }
      }
      gameOver = false;
    };

    function checkRow(cell, arrayOfCells) {
      let difference = 1;

      if (
        arrayOfCells[cell - difference].getCellMarker() ==
          arrayOfCells[cell].getCellMarker() &&
        arrayOfCells[cell - difference].getCellMarker() ==
          arrayOfCells[cell + difference].getCellMarker()
      ) {
        return true;
      } else {
        return false;
      }
    }

    function checkColumn(cell, arrayOfCells) {
      let difference = 3;

      if (
        arrayOfCells[cell - difference].getCellMarker() ==
          arrayOfCells[cell].getCellMarker() &&
        arrayOfCells[cell - difference].getCellMarker() ==
          arrayOfCells[cell + difference].getCellMarker()
      ) {
        return true;
      } else {
        return false;
      }
    }

    function checkDiagonals(cellNum, arrayOfCells) {
      if (cellNum == 1) {
        if (
          arrayOfCells[0].getCellMarker() == arrayOfCells[4].getCellMarker() &&
          arrayOfCells[0].getCellMarker() == arrayOfCells[8].getCellMarker()
        ) {
          return true;
        }
      } else if (cellNum == 3) {
        if (
          arrayOfCells[2].getCellMarker() == arrayOfCells[4].getCellMarker() &&
          arrayOfCells[2].getCellMarker() == arrayOfCells[6].getCellMarker()
        ) {
          return true;
        }
      }
      return false;
    }

    return { placeMarker, getLevel, setLevel };
  })();

  //call objects
  GameBoard.populateBoard();
  GameBoard.setUpDisplay(gamePlay.placeMarker, gamePlay);
}

function createDisplay(placeMarker, gamePlayObject) {
  let setUpDisplay = (function () {
    let body = document.querySelector("body");

    let player1;
    let player2;

    const setUpButtons = function () {
      //set up buttons
      setUpPlayerVsComputer();
      setUpPlayerVsPlayer();
    };

    const setUpPlayerVsComputer = function () {
      const pvc = document.getElementById("computer");
      pvc.addEventListener("click", () => {
        getPlayersNames(1);
      });
    };

    const setUpPlayerVsPlayer = function () {
      const pvp = document.getElementById("player");
      pvp.addEventListener("click", () => {
        getPlayersNames(2);
      });
    };

    const changeBackground = function () {
      const background = document.querySelector("body");
      background.style.backgroundImage = "none";
      background.style.backgroundColor = "black";
    };

    const addBoard = function (isComputer) {
      //Remove modal
      const optionsModal = document.querySelector("body>div");
      body.removeChild(optionsModal);

      //Add board
      let newBoard = document.createElement("div");
      let container = document.createElement("div");

      for (let i = 1; i <= 9; i++) {
        let currentCell = document.createElement("div");
        currentCell.id = "cell" + i;
        currentCell.classList.add("cellProperties");

        currentCell.addEventListener("click", () => {
          placeMarker(currentCell.id, player1, player2, isComputer);
        });

        container.appendChild(currentCell);
      }

      container.classList.add("container");

      newBoard.appendChild(container);
      body.appendChild(newBoard);
    };

    const getPlayersNames = function (numPlayers) {
      let modal = document.querySelector("body>div");
      let header = document.querySelector("body>div>h1");
      let buttons = document.querySelector("body>div>div");
      modal.removeChild(header);
      modal.removeChild(buttons);
      modal.style.height = "600px";

      //modal header
      let modalHeader = document.createElement("h1");
      modalHeader.textContent = "Settings";
      modalHeader.style.margin = "0";
      modal.appendChild(modalHeader);

      //user 1 name
      let player1Object = getUserName(1);
      modal.appendChild(player1Object.playerInputDiv);

      let button = document.createElement("button");
      button.textContent = "Start";

      if (numPlayers == 2) {
        let player2Object = getUserName(2);
        modal.appendChild(player2Object.playerInputDiv);

        //Start game
        button.addEventListener("click", () => {
          changeBackground();
          addBoard(false);

          player1 = createPlayer();
          if (player1Object.playerNameInput.value != "") {
            player1.setName(player1Object.playerNameInput.value);
          } else {
            player1.setName("Player 1");
          }

          player1.setMarker("X");

          player2 = createPlayer();
          if (player2Object.playerNameInput.value != "") {
            player2.setName(player2Object.playerNameInput.value);
          } else {
            player2.setName("Player 2");
          }
          player2.setMarker("O");

          //false because not playing against computer
          addScores(false, player1.getName(), player2.getName());
        });
      } else {
        let computerLevelDiv = computerLevelFunction();
        modal.appendChild(computerLevelDiv);

        //Start game
        button.addEventListener("click", () => {
          let computerDifficuly = document.getElementById("computerLevels");
          console.log(computerDifficuly.value);
          gamePlayObject.setLevel(computerDifficuly.value);

          changeBackground();
          addBoard(true);

          player1 = createPlayer();
          if (player1Object.playerNameInput.value != "") {
            player1.setName(player1Object.playerNameInput.value);
          } else {
            player1.setName("Player 1");
          }
          player1.setMarker("X");

          player2 = createPlayer();
          player2.setName("Computer");
          player2.setMarker("O");

          //true because playing against computer
          addScores(true, player1.getName(), player2.getName());
        });
      }

      modal.appendChild(button);

      return { player1, player2 };
    };

    //factory function to create player
    const createPlayer = function () {
      let name;
      let marker;
      let numWins = 0;

      const setName = (playerName) => {
        name = playerName;
      };

      const setMarker = (playerMarker) => {
        marker = playerMarker;
      };

      const increaseScore = () => {
        numWins += 1;
      };

      const getName = () => name;
      const getMarker = () => marker;
      const getNumWins = () => numWins;

      return {
        setName,
        getName,
        setMarker,
        getMarker,
        increaseScore,
        getNumWins,
      };
    };

    //get user name
    function getUserName(playerNumber) {
      let playerInputDiv = document.createElement("div");
      let playerNameLabel = document.createElement("label");
      playerNameLabel.htmlFor = "playerNameInput" + playerNumber;
      playerNameLabel.textContent = "Player " + playerNumber + " Name:";
      let playerNameInput = document.createElement("input");
      playerNameInput.id = "playerNameInput" + playerNumber;
      playerNameInput.type = "text";
      playerNameInput.name = "playerNameInput";

      playerInputDiv.appendChild(playerNameLabel);
      playerInputDiv.appendChild(playerNameInput);
      return { playerInputDiv, playerNameInput };
    }

    //computer level
    const computerLevelFunction = function () {
      let computerLevelDiv = document.createElement("div");
      let computerLevelLabel = document.createElement("label");
      computerLevelLabel.htmlFor = "computerLevels";
      computerLevelLabel.textContent = "Computer Difficulty:";
      let computerLevel = document.createElement("select");
      computerLevel.id = "computerLevels";
      const computerLevels = ["Easy", "Medium", "Hard", "Unbeatable"];
      for (let i = 0; i < 4; i++) {
        let currentOption = document.createElement("option");
        currentOption.value = computerLevels[i];
        currentOption.textContent = computerLevels[i];
        computerLevel.appendChild(currentOption);
      }

      computerLevelDiv.appendChild(computerLevelLabel);
      computerLevelDiv.appendChild(computerLevel);
      return computerLevelDiv;
    };

    //add scores to UI
    const addScores = function (isComputer, player1Name, player2Name) {
      let scoresDiv = document.createElement("div");
      scoresDiv.id = "scores";
      for (let i = 0; i < 3; i++) {
        let currentDiv = document.createElement("div");
        let currentDivText = document.createElement("div");

        if (i === 0) {
          currentDiv.id = "player1Score";
          currentDivText.textContent =
            player1Name == "" ? "Player 1 (X)" : player1Name + " (X)";
        } else if (i === 1) {
          currentDiv.id = "tie";
          currentDivText.textContent = "Ties";
        } else {
          if (isComputer === true) {
            currentDiv.id = "computerScore";
            currentDivText.textContent =
              "AI " + gamePlayObject.getLevel() + " (O)";
          } else {
            currentDiv.id = "player2Score";
            currentDivText.textContent =
              player2Name == "" ? "Player 2 (O)" : player2Name + " (O)";
          }
        }

        currentDiv.appendChild(currentDivText);
        let playerScore = document.createElement("div");
        playerScore.textContent = "0";
        currentDiv.appendChild(playerScore);
        scoresDiv.appendChild(currentDiv);
      }

      body.appendChild(scoresDiv);
    };

    return { setUpButtons, player1, player2 };
  })();

  return setUpDisplay;
}
