import { Component, OnInit, Input } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
})
export class ContainerComponent implements OnInit {
  cells = [];

  width: number = 32;
  height: number = 32;

  refreshRate: number = 1000;

  screenHeight: number;
  screenWidth: number;

  paused: boolean = false;

  drawer;

  constructor() {
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    // this.screenHeight = window.innerHeight;
    // this.screenWidth = window.innerWidth;
    this.screenHeight = 16 * this.width;
    this.screenWidth = 16 * this.height;
  }

  ngOnInit(): void {
    this.cells = this.randomPosition(this.screenWidth, this.screenHeight);
    this.drawer = setInterval(() => {
      this.redraw();
    }, this.refreshRate);
  }

  private randomPosition(width, height): string[] {
    const cells = [];
    for (let x = 0; x < width; x += 16) {
      for (let y = 0; y < height; y += 16) {
        cells.push(Math.random() > 0.5 ? true : false);
      }
    }

    return cells;
  }

  private updateCells(height, width) {
    const new_cells = [...this.cells];

    for (let x = 0; x < this.cells.length; x++) {
      this.checkSurroundingCells(x, height, width, new_cells);
    }
    return new_cells;
  }

  private checkSurroundingCells(loc, delta_y, width, new_cells) {
    const left_edge = loc % width == 0;
    const right_edge = loc % width == width - 1;
    let delta_x = 1;

    let ne, e, se;
    ne = e = se = 0;

    if (!right_edge) {
      ne = this.cells[loc + delta_x - delta_y] || 0;
      e = this.cells[loc + delta_x] || 0;
      se = this.cells[loc + delta_x + delta_y] || 0;
    }

    let nw, w, sw;
    nw = w = sw = 0;

    if (!left_edge) {
      nw = this.cells[loc - delta_x - delta_y] || 0;
      w = this.cells[loc - delta_x] || 0;
      sw = this.cells[loc - delta_x + delta_y] || 0;
    }

    let n = this.cells[loc - delta_y] || 0;
    let s = this.cells[loc + delta_y] || 0;

    let val = nw + n + ne + w + e + sw + s + se;

    if (this.cells[loc]) {
      if (val < 2) {
        new_cells[loc] = false;
      } else if (val <= 3) {
        new_cells[loc] = true;
      } else if (val > 3) {
        new_cells[loc] = false;
      }
    } else {
      if (val == 3) {
        new_cells[loc] = true;
      }
    }
  }

  private redraw() {
    let new_cells = this.updateCells(this.width, this.height);

    this.cells = new_cells;
  }

  public restart() {
    this.cells = this.randomPosition(this.screenWidth, this.screenHeight);
  }

  public pause() {
    this.paused = !this.paused;

    if (this.paused) {
      clearInterval(this.drawer);
    } else {
      this.drawer = setInterval(() => {
        this.redraw();
      }, this.refreshRate);
    }
  }

  public step() {
    this.redraw();
  }
}
