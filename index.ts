import { GameState, makeRandomGuess } from "./game";

async function game(symbolSpaceLength: number, solutionLength: number) {
  console.log(
    "Rules",
    `Possible characters: ${symbolSpaceLength}`,
    `Solution length: ${solutionLength}`
  );
  console.log("Preparing the game...");

  console.time("Solved");

  const gameState = new GameState(symbolSpaceLength, solutionLength);

  console.log("Picking a solution...");
  const solution = makeRandomGuess(gameState.solutionSpace);

  console.log("Solving...");

  while (!gameState.trySolve(solution));

  console.timeEnd("Solved");
  console.log(`Solved ${solution} in ${gameState.turns.length} turns!`);
  console.table(gameState.turns);
}

const d = 10;
const n = 4;
game(d, n);
