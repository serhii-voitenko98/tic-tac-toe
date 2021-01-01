import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss']
})
export class TicTacToeComponent implements OnInit {
  @ViewChildren('cell') cells!: QueryList<any>;
  @ViewChild('game') game!: ElementRef;

  rows = 3;
  columns = 3;
  elements: Array<Array<number>> = new Array<Array<number>>();
  ticSteps: Array<string> = new Array<string>(); // Current steps of 'tic' player
  tacSteps: Array<string> = new Array<string>(); // Current steps of 'tac' player
  combinations: Array<Array<string>> = [
    ['1', '2', '3'],
    ['1', '4', '7'],
    ['1', '5', '9'],
    ['2', '5', '8'],
    ['3', '5', '7'],
    ['3', '6', '9'],
    ['4', '5', '6'],
    ['7', '8', '9']
  ]; // All the win combinations
  switcher = true; // Switch between 'tic' and 'tac' players. By default 'tic'
  winner!: 'tic' | 'tac' | 'draw' | null; // Winner's name or draw
  count: {[key: string]: number} = {
    ticCount: 0,
    tacCount: 0
  }
  isGameStopped = false;

  ngOnInit(): void {
    let counter = 0;

    for (let i = 0; i < this.rows; i++) {
      this.elements[i] = new Array<number>(this.columns);

      for (let j = 0; j < this.columns; j++) {
        counter++;
        this.elements[i][j] = counter;
      }
    }
  }

  update(cellElement: HTMLElement) {
    const currentPlayer = this.switcher ? 'tic' : 'tac';

    if (!cellElement.classList.contains('active')) {
      cellElement.classList.add('active');
      cellElement.classList.add(currentPlayer);

      if (currentPlayer === 'tic') {
        this.ticSteps.push(cellElement.id);
      } else if (currentPlayer === 'tac') {
        this.tacSteps.push(cellElement.id);
      }

      this.checkForWinner();

      if (!this.winner) {
        this.switcher = !this.switcher;
      }
    }

    // console.log(this.ticSteps);
    // console.log(this.tacSteps);
  }

  checkForWinner(): void {
    if (this.ticSteps.length >= 3 || this.tacSteps.length >= 3) {
      const checker = (arr: Array<string>, target: Array<string>) => target.every((v: string) => arr.includes(v));
      let checkForTicWin = false;
      let checkForTacWin = false;

      for (let i = 0; i < this.combinations.length; i++) {
        checkForTicWin = checker(this.ticSteps, this.combinations[i]);
        checkForTacWin = checker(this.tacSteps, this.combinations[i]);


        if (checkForTicWin) {
          this.setNewWinner('tic', i);
          break;
        }

        if (checkForTacWin) {
          this.setNewWinner('tac', i);
          break;
        }
      }

      if (this.ticSteps.length === 5 || this.tacSteps.length === 5) {
        if (!checkForTicWin && !checkForTacWin) {
          this.winner = 'draw';
        }
      }
    }
  }

  setNewWinner(winner: 'tic' | 'tac', currentIteration: number): void {
    this.isGameStopped = true;
    this.count[`${winner}Count`]++;
    this.updateGameClass(`${winner}-${currentIteration + 1}`);

    const promise = new Promise(resolve => {
      setTimeout(() => {
        this.winner = winner;
        resolve();
      }, 1000);
    });
    promise.then(() => {
      this.isGameStopped = false;
    });
  }

  reset(): void {
    if (this.winner) {
      this.updateGameClass();
    }

    this.resetGame();
  }

  resetGame(): void {
    this.ticSteps = new Array<string>();
    this.tacSteps = new Array<string>();
    this.winner = null;
    this.switcher = true; // Manually set switcher to 'tic' after reset
    this.cells.toArray().forEach((item) => {
      item.nativeElement.classList.remove('active', 'tic', 'tac');
    });
  }

  updateGameClass(className?: string): void {
    const gameElement = this.game.nativeElement;
    const classes = gameElement.className.split(" ").filter((c: string) => {
      return !(c.includes('tic-')) && !(c.includes('tac-'));
    });
    gameElement.className = classes.join(' ').trim();
    if (className) {
      gameElement.classList.add(className!);
    }
  }
}
