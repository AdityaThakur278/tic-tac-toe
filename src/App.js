import { useState } from "react";
import styles from "./app.module.css";

const initialBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const getPlayerChance = (board) => {
  let xCount = 0;
  let oCount = 0;

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j] === "X") xCount++;
      if (board[i][j] === "O") oCount++;
    }
  }

  if (xCount <= oCount) return "X";
  return "O";
};

const getUpdatedBoard = (board, rIndex, cIndex, playerChance) => {
  return board.map((boardItem, row) => {
    if (rIndex === row) {
      const updatedRow = [...boardItem];
      updatedRow[cIndex] = playerChance;
      return updatedRow;
    }

    return [...boardItem];
  });
};

const getWinnerInfo = (board) => {
  const n = board.length;

  // check row wise same
  for (let i = 0; i < n; i++) {
    let isRowSame = true;
    for (let j = 1; j < n; j++) {
      isRowSame &= board[i][j] === board[i][j - 1];
    }
    if (isRowSame && board[i][0]) {
      return { isWinner: true, winner: board[i][0] };
    }
  }

  // check col wise same
  for (let j = 0; j < n; j++) {
    let isColSame = true;
    for (let i = 1; i < n; i++) {
      isColSame &= board[i][j] === board[i - 1][j];
    }
    if (isColSame && board[0][j]) {
      return { isWinner: true, winner: board[0][j] };
    }
  }

  // check left diagonal
  let isLeftDiagonalSame = true;
  for (let i = 1; i < n; i++) {
    isLeftDiagonalSame &= board[i][i] === board[i - 1][i - 1];
  }
  if (isLeftDiagonalSame && board[0][0])
    return { isWinner: true, winner: board[0][0] };

  // check right diagonal
  let isRightDiagonalSame = true;
  for (let i = 1; i < n; i++) {
    isRightDiagonalSame &= board[i][n - i - 1] === board[i - 1][n - i];
  }
  if (isRightDiagonalSame && board[0][n - 1])
    return { isWinner: true, winner: board[0][n - 1] };

  return { isWinner: false, winner: null };
};

function App() {
  const [board, setBoard] = useState(initialBoard);
  const [steps, setSteps] = useState([
    { board: initialBoard, label: "Go to start game" },
  ]);
  const [currentStep, setCurrentStep] = useState(0);

  const playerChance = getPlayerChance(board);

  const { isWinner, winner } = getWinnerInfo(board);

  const handleClick = (r, c) => () => {
    if (board[r][c] || isWinner) return;

    const updatedBoard = getUpdatedBoard(board, r, c, playerChance);

    const updatedSteps = steps.slice(0, currentStep + 1);
    updatedSteps.push({
      board: updatedBoard,
      label: `Go to step #${currentStep + 1}`,
    });
    setSteps(updatedSteps);

    setCurrentStep(currentStep + 1);

    setBoard(updatedBoard);
  };

  const handleStepClick = (index) => () => {
    setBoard(steps[index].board);
    setCurrentStep(index);
  };

  return (
    <div className={styles.parentContainer}>
      <div className={styles.gameContainer}>
        {isWinner ? (
          <div>Winner: {winner}</div>
        ) : (
          <div>Next Chance: {playerChance}</div>
        )}
        <table className={styles.tableContainer}>
          {board.map((boardItem, r) => {
            return (
              <tr>
                <td onClick={handleClick(r, 0)} className={styles.tableCell}>
                  {boardItem[0]}
                </td>
                <td onClick={handleClick(r, 1)} className={styles.tableCell}>
                  {boardItem[1]}
                </td>
                <td onClick={handleClick(r, 2)} className={styles.tableCell}>
                  {boardItem[2]}
                </td>
              </tr>
            );
          })}
        </table>
      </div>
      <div className={styles.buttonContainer}>
        {steps.map((stepItem, index) => {
          return (
            <button
              className={styles.stepButton}
              onClick={handleStepClick(index)}
            >
              {stepItem.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default App;
