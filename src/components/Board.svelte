<script lang="ts">
  import { Snake as S } from "./Snake";
  import type { Direction } from "./Snake";
  import type { Cell, Coordinate } from "../@types";

  let highScore = 0;
  let isHighScore = false;
  const GRID_SIZE = 20;
  const Snake = new S();
  const DELAY = 200;

  let positions: Coordinate[] = [[10, 10]];
  let direction: Direction = "left";

  let board: Array<Array<Cell>> = [...Array(GRID_SIZE)].map(() =>
    [...Array(GRID_SIZE)].map(() => "empty")
  );
  let hasStarted = false;
  let hasLost = false;

  $: FINAL_DELAY = Math.max(DELAY - positions.length * 10, 80);

  function reset() {
    positions = [[10, 10]];
    hasLost = false;
    board = [...Array(GRID_SIZE)].map(() => [...Array(GRID_SIZE)].map(() => "empty"));

    randomFood();
  }

  function run(n: number) {
    setTimeout(() => {
      const result = Snake.move(positions, direction, board, { onEat: randomFood });

      // Lost the game
      if (result === null) {
        hasLost = true;
        hasStarted = false;

        const res = Snake.registerScore(positions.length);
        isHighScore = res[0];
        highScore = res[1];
        return;
      }
      positions = result;

      run(FINAL_DELAY);
    }, n);
  }

  function start() {
    if (hasStarted) return;
    hasStarted = true;
    reset();
    run(FINAL_DELAY);
  }

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function randomFood() {
    const [x, y] = [getRandomInt(GRID_SIZE), getRandomInt(GRID_SIZE)];
    const cell = board[x][y];
    if (cell !== "empty") {
      randomFood();
      return;
    }

    board[x][y] = "food";
  }

  $: {
    board.forEach((row, x) => {
      row.forEach((cell, y) => {
        if (cell === "snake") {
          board[x][y] = "empty";
        }
      });
    });

    positions.forEach(([x, y]) => {
      board[x][y] = "snake";
    });
  }
</script>

<svelte:window on:keydown={(e) => (direction = Snake.handleKeydown(e, start) || direction)} />

<div class="wrapper">
  <div class="score">
    <h2>Points: {positions.length}</h2>
    {#if hasLost}
      <h2>Highscore: {highScore}</h2>
    {/if}
  </div>
  <div class="board" style="--count: {GRID_SIZE}">
    {#each board as row}
      {#each row as cell}
        <div class={`square ${cell}`} class:snake={cell === "snake"} class:food={cell === "food"} />
      {/each}
    {/each}
  </div>
  {#if hasLost}
    <h3>You lost</h3>
  {/if}
  {#if !hasStarted}
    <button on:click={start}> Start </button>
  {/if}
</div>

<style>
  .wrapper {
    padding-top: 50px;
    max-height: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  button {
    margin-top: 2rem;
    padding: 1rem;
  }

  .score {
    display: flex;
    gap: 2rem;
  }

  .board {
    display: grid;
    grid-template-columns: repeat(var(--count, 10), 1fr);
    justify-items: center;

    margin: auto;
    gap: 1px;
    height: 600px;
    width: 600px;
    max-width: 90%;
    max-height: 90%;
  }
  .square {
    background: #000;
    width: 100%;
  }
  .snake {
    background-color: rgb(9, 165, 9);
  }

  .food {
    background-color: red;
  }
</style>
