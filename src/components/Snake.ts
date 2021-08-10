import { Cell, Coordinate } from "../@types";

export type Direction = "up" | "down" | "left" | "right";
export class Snake {
  private directionMapping: { [key in Direction]: Coordinate } = {
    down: [1, 0],
    left: [0, -1],
    right: [0, 1],
    up: [-1, 0],
  };

  constructor() {}

  move(positions: Coordinate[], direction: Direction, board: Cell[][], { onEat = () => {} }) {
    const snake = positions;

    const head = snake[0];
    const [dx, dy] = this.directionMapping[direction];

    const newX = this.calculateNewPosition(head[0], dx);
    const newY = this.calculateNewPosition(head[1], dy);
    const newHead: Coordinate = [newX, newY];

    const shouldGrow = board[newX][newY] === "food";

    if (shouldGrow) {
      onEat();
    }
    const body = snake.slice(0, snake.length - (shouldGrow ? 0 : 1));

    const isDead = body.some((s) => s[0] === newHead[0] && s[1] === newHead[1]);

    if (isDead) {
      return null;
    }

    return [newHead, ...body];
  }

  registerScore(score: number) {
    const highScore = JSON.parse(localStorage.getItem("highScore")) as number;

    console.log(highScore);
    if (!highScore || highScore < score) {
      localStorage.setItem("highScore", score.toString());
      return [true, score] as const;
    }

    return [false, highScore] as const;
  }

  private calculateNewPosition(coor: number, delta: number) {
    const sum = coor + delta;
    if (this.willHitWall(coor, delta)) {
      return sum >= 20 ? 0 : 19;
    }
    return sum;
  }

  private willHitWall(coor: number, delta: number) {
    const sum = coor + delta;
    if (sum >= 20 || sum < 0) {
      return true;
    }
    return false;
  }

  handleKeydown(e: KeyboardEvent, onEnter: () => void) {
    switch (e.key) {
      case "ArrowLeft":
        return "left";

      case "ArrowRight":
        return "right";

      case "ArrowUp":
        return "up";

      case "ArrowDown":
        return "down";

      case "Enter":
        onEnter();
        break;
    }
  }
}
