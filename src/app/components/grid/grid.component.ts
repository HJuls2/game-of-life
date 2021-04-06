import { Simulation } from './../../model/Simulation';
import { TileState } from './../../model/TileState';
import { Tile } from './../../model/Tile';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  // Dimension of the grid is step by the main component AppComponent; if not provided a 10x10 grid is initialized
  @Input() dimension: number = 10;
  tiles: Tile[];
  numNeighborsPerTile: number[];
  public simulation: Simulation;


  constructor(private steadyStateSnackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.tiles = new Array(this.dimension * this.dimension);
    this.numNeighborsPerTile = new Array(this.dimension * this.dimension);

    for (let id = 0; id < this.dimension * this.dimension; id++) {
      this.tiles[id] = new Tile(id);
      this.numNeighborsPerTile[id] = 0;
    }

    this.simulation = new Simulation();
  }

  /* ----- User Interaction Methods ----- */

  /**
   * As a result of a user interaction with a Tile when the simulation is stopped/paused:
   * - reset the counter of performed steps;
   * - reset the life time of all tiles;
   * - check the state of the clicked tile;
   * - update the tile state and its neighbors state appropriately.
   * @param tile The tile clicked by the user.
   */
  public onTileClick(tile: Tile) {
    if (this.simulation.isPlayed()) {
      return;
    }
    this.simulation.resetTime();
    for(const t of this.tiles){
      t.resetLifeTime();
    }
    if (!tile.isAlive()) {
      tile.state = TileState.ALIVE;
      this.updateNeighbors(tile);
    } else {
      tile.die();
      this.updateNeighbors(tile);
    }
  }

  public playSimulation(): void {
    this.simulation.played = true;
    const intervalId = window.setInterval(() => this.computeNextGlobalState(), 1000 / this.simulation.speed);
    this.simulation.intervalId = intervalId;
  }

  public pauseSimulation() {
    this.simulation.played = false;
    window.clearInterval(this.simulation.intervalId);
  }

  public reset() {
    for (const tile of this.tiles) {
      tile.reset();
      this.numNeighborsPerTile[this.tiles.indexOf(tile)] = 0;
    }
    this.simulation.resetTime();
    this.simulation.intervalId = null;
  }

  /**
   *  Opens a snackbar that warns the user that the grid has reached a steady state.
   */
  private openSteadyStateSnackbar(): void {
    const message = this.simulation.isPlayed() ? 'The game of life has reached a steady state. Simulation has been stopped.' : 'The game of life has reached a steady state.';
    this.steadyStateSnackbar.open(message, null, {
      duration: 3000
    });
    this.pauseSimulation();
  }

  /* ----- Grid Management Logic ----- */

  /**
   * Compute the next state of the whole grid according to the current situation.
   */
  public computeNextGlobalState(): void {
    this.simulation.increaseTime();

    // Array to store the variations (in terms of number of neighbors) for each tile
    const variations = new Array(this.tiles.length).fill(0);

    // Retrieve tiles that are going to die
    const eligibleToDie = this.tiles.filter(tile =>
      tile.isAlive() && (this.numNeighborsPerTile[tile.id] <= 1 || this.numNeighborsPerTile[tile.id] >= 4)
    );

    // Retrieve tiles that are going to survive
    const eligleToSurvive = this.tiles.filter(tile =>
      tile.isAlive() && (this.numNeighborsPerTile[tile.id] === 2 || this.numNeighborsPerTile[tile.id] === 3)
    )

    // Retrieve tiles that are going to born
    const eligibleToBorn = this.tiles.filter(tile => !tile.isAlive() && this.numNeighborsPerTile[tile.id] === 3);

    // Check if the simulation has reached a steady state
    if (eligibleToBorn.length === 0 && eligibleToDie.length === 0) {
      this.openSteadyStateSnackbar();
    }

    // Kill the tiles eligible to die and decrease by one the number of neighbors for every neighbor of the killed tiles
    for (const tile of eligibleToDie) {
      const neighborsIds = this.getNeighbors(tile.id);
      tile.die();
      for (const id of neighborsIds) {
        variations[id] -= 1;
      }
      this.tiles[tile.id] = tile;
    }

    for(const tile of eligleToSurvive){
      tile.increaseLifeTime();
    }

    // Give birth to the tiles eligible to born and increase by one the number of neighbors for every neighbor of the newborn tiles
    for (const tile of eligibleToBorn) {
      const neighborsIds = this.getNeighbors(tile.id);
      tile.born();
      for (const id of neighborsIds) {
        variations[id] += 1;
      }
      this.tiles[tile.id] = tile;
    }

    // Update the number of neighbors for every tile
    for (let id = 0; id < this.tiles.length; id++) {
      this.numNeighborsPerTile[id] += variations[id];
    }

  }


  /* ----- Support Methods ----- */

  /**
   * Returns the tiles ids that border on the specified tile.
   * @param id Id number of a target tile.
   * @returns Array of ids of the neighbors.
   */
  private getNeighbors(id: number): number[] {
    /* LEGEND:
    |  id - this.dimension - 1   |    id - this.dimension  |  id - this.dimension + 1  |
    |----------------------------|-------------------------|---------------------------|
    |         id - 1             |         id              |        id + 1             |
    |----------------------------|-------------------------|---------------------------|
    |  id + this.dimension - 1   |  id + this.dimension    |  id + this.dimension + 1  |
    */

    // Take all (valid) neighbors candidates IDs
    let neighborhood = [
      id - this.dimension - 1,
      id - this.dimension,
      id - this.dimension + 1,
      id - 1,
      id + 1,
      id + this.dimension - 1,
      id + this.dimension,
      id + this.dimension + 1
    ].filter(tileId => tileId >= 0 && tileId < this.dimension * this.dimension);

    // Edges Management: on the edges the normal neighborhood must be filtered
    if (id % this.dimension === 0) {
      // FIRST COLUMN CASE: discard top left, left and bottom left tiles
      neighborhood =
        neighborhood.filter(tileId => tileId !== id - this.dimension - 1 && tileId !== id - 1 && tileId !== id + this.dimension - 1);
    } else if (id % this.dimension === this.dimension - 1) {
      // LAST COLUMN CASE: discard top right, right and bottom right tiles
      neighborhood =
        neighborhood.filter(tileId => tileId !== id - this.dimension + 1 && tileId !== id + 1 && tileId !== id + this.dimension + 1);
    }
    return neighborhood;
  }

  /**
   * Updates, for all the tiles that border on the specified one, the neighborhood statistics.
   * @param tile The tile that borders the tiles to update.
   */
  private updateNeighbors(tile: Tile): void {
    const neighborsIds = this.getNeighbors(tile.id);
    if (tile.state === TileState.ALIVE) {
      for (const id of neighborsIds) {
        this.numNeighborsPerTile[id] += 1;
      }
    } else {
      for (const id of neighborsIds) {
        this.numNeighborsPerTile[id] -= 1;
      }
    }
  }

}
