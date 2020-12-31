import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss']
})
export class TicTacToeComponent implements OnInit {
  @ViewChildren('cell') cells!: QueryList<any>;

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
  winner = ''; // Name of the winner
  isGameStopped = false;
  count = {
    ticCount: 0,
    tacCount: 0
  }

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
    if (!this.isGameStopped) {
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

      console.log(this.ticSteps);
      console.log(this.tacSteps);
    }
  }

  checkForWinner(): void {
    const checker = (arr: Array<string>, target: Array<string>) => target.every((v: string) => arr.includes(v));

    if (this.ticSteps.length >= 3 || this.tacSteps.length >= 3) {
      for (let i = 0; i < this.combinations.length; i++) {
        const checkForTicWin = checker(this.ticSteps, this.combinations[i]);
        const checkForTacWin = checker(this.tacSteps, this.combinations[i]);

        if (checkForTicWin) {
          this.winner = 'tic';
          this.count.ticCount++;
        }

        if (checkForTacWin) {
          this.winner = 'tac';
          this.count.tacCount++;
        }

        if (checkForTicWin || checkForTacWin) {
          console.log(this.winner + ' is a winner');
          this.isGameStopped = true;
        }
      }
    }
  }


  reset(): void {
    if (this.isGameStopped) {
      this.ticSteps = new Array<string>();
      this.tacSteps = new Array<string>();
      this.winner = '';
      this.isGameStopped = !this.isGameStopped;
      this.switcher = true; // Manually set 'tic' after reset

      this.cells.toArray().forEach((item) => {
        item.nativeElement.classList.remove('active', 'tic', 'tac');
      });
    }
  }
}
