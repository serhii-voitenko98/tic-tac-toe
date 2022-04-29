import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { AuthService } from '../auth/auth.service';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss']
})
export class TicTacToeComponent implements OnInit {
  @Input() roomId!: string;
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
  switcher?: 'tic' | 'tac'; // Switch between 'tic' and 'tac' players. By default 'tic'
  winner!: 'tic' | 'tac' | 'draw' | null; // Winner's name or draw
  count: { ticCount: number; tacCount: number } = {
    ticCount: 0,
    tacCount: 0
  }
  isGameStopped = false;
  stepDisabled = false;
  socketConnected = false;
  destroyed$ = new Subject();

  constructor(
    private socketService: SocketService,
    private snackbar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    let counter = 0;

    for (let i = 0; i < this.rows; i++) {
      this.elements[i] = new Array<number>(this.columns);

      for (let j = 0; j < this.columns; j++) {
        counter++;
        this.elements[i][j] = counter;
      }
    }

    this.socketConnected = true;
    this.subscribeToSocketEvents();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  handleColumnClick(cellElement: HTMLElement, index: number): void {
    if (this.stepDisabled) {
      return;
    }
    this.update(cellElement, index);
    if (this.socketConnected) {
      this.stepDisabled = true;
    }
  }

  update(cellElement: HTMLElement, index?: number): void {
    if (!this.switcher) {
      return;
    }

    if (!cellElement.classList.contains('active') && !this.isGameStopped && !this.winner) {
      cellElement.classList.add('active');
      cellElement.classList.add(this.switcher);

      if (this.switcher === 'tic') {
        this.ticSteps.push(cellElement.id);
      } else if (this.switcher === 'tac') {
        this.tacSteps.push(cellElement.id);
      }

      if (index) {
        this.socketService.emitEvent('newStep', { player: this.switcher, index, roomId: this.roomId });
      }

      this.checkForWinner();

      if (!this.winner) {
        this.switcher = this.switcher === 'tic' ? 'tac' : 'tic';
      }
    }
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
    if (winner === 'tic') {
      this.count.ticCount++;
    } else {
      this.count.tacCount++;
    }
    this.updateGameClass(`${winner}-${currentIteration + 1}`);

    const promise = new Promise<void>(resolve => {
      setTimeout(() => {
        this.winner = winner;
        resolve();
      }, 1000);
    });
    promise.then(() => {
      this.isGameStopped = false;
    });
  }

  handleRestartClick(): void {
    this.reset();
    this.socketService.emitEvent('reset', { roomId: this.roomId });
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
    this.switcher = undefined;
    this.stepDisabled = false;
    this.cells.toArray().forEach((item) => {
      item.nativeElement.classList.remove('active', 'tic', 'tac');
    });
  }

  resetCount(): void {
    this.count.ticCount = 0;
    this.count.tacCount = 0;
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

  switchPlayer(value: 'tic' | 'tac'): void {
    if (Boolean(this.switcher)) {
      return;
    }
    this.switcher = value;
    this.socketService.emitEvent('switcher', { roomId: this.roomId, value, username: this.authService.getUser().username });
  }

  private subscribeToSocketEvents(): void {
    this.socketService.onNewMessage('newStep').subscribe((data: { player: 'tic' | 'tac'; index: number }) => {
      console.log('on newStep');
      const cellElement: ElementRef = this.cells.toArray().find((item) => {
        return (item.nativeElement as HTMLTableCellElement).getAttribute('id') === data.index.toString();
      });

      this.update(cellElement.nativeElement);
      this.stepDisabled = false;
    });

    this.socketService.onNewMessage('switcher').subscribe((data: { value: 'tic' | 'tac'; username: string }) => {
      console.log('on switcher');
      this.switcher = data.value;
      this.snackbar.open(`${data.username} has choosen ${data.value} side!`);
      this.stepDisabled = true;
    });

    this.socketService.onNewMessage('joinRoom').subscribe((data) => {
      if (data.room === this.roomId) {
        this.reset();
        this.socketService.emitEvent('counter', { roomId: this.roomId, count: this.count });
      }
    });

    this.socketService.onNewMessage('leaveRoom').subscribe((data) => {
      if (data.room === this.roomId) {
        this.reset();
      }
    });

    this.socketService.onNewMessage('reset').subscribe(() => {
      console.log('on reset');
      this.reset();
    });

    this.socketService.onNewMessage('counter').subscribe((data: { count: { ticCount: number; tacCount: number } }) => {
      console.log('on counter');
      this.count = data.count;
    });
  }
}
