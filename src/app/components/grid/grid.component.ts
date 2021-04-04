import { Simulation } from './../../model/Simulation';
import { TileState } from './../../model/TileState';
import { Tile } from './../../model/Tile';
import { Component, Input, OnInit} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit{

  @Input() dimension: number;
  tiles: Tile[];
  numNeighborsPerTile: number[];
  public simulation: Simulation;


  constructor(private steadyStateSnackbar: MatSnackBar) { }

  ngOnInit(): void {
    if (!this.dimension) {
      this.dimension = 10;
    }

    this.tiles = new Array(this.dimension *  this.dimension);
    this.numNeighborsPerTile = new Array(this.dimension * this.dimension);

    for(let id = 0; id < this.dimension * this.dimension; id++){
      this.tiles[id] = new Tile(id);
      this.numNeighborsPerTile[id] = 0;
    }

    this.simulation = new Simulation();
  }

  /**
   * Performs operations as a result of a user interaction with a Tile when the simulation is stopped/paused.
   * @param tile The tile clicked by the user.
   */
  public onTileClick(tile: Tile){
    if(this.simulation.isPlayed()){
      return;
    }
    this.simulation.resetTime();
    if(tile.getState() !== TileState.ALIVE){
      tile.setState(TileState.ALIVE);
      this.updateNeighbors(tile);
    } else {
      tile.setState(TileState.EMPTY);
      this.updateNeighbors(tile);
    }
  }

  public playSimulation(): void{
    this.simulation.setPlayed(true);
    const intervalId =  window.setInterval(() => this.computeNextGlobalState(), 1000 / this.simulation.getSpeed());
    this.simulation.setIntervalId(intervalId);
  }

  public pauseSimulation(){
    this.simulation.setPlayed(false);
    window.clearInterval(this.simulation.getIntervalId());
  }

  public updateSimulationSpeed(event){
    this.simulation.setSpeed(event.value);
  }

  /**
   * Compute the next state of the whole grid according to the current situation.
   */
  public computeNextGlobalState(): void{
    this.simulation.increaseTime();

    // Array to store the variations (in terms of number of neighbors) for each tile
    const variations = new Array(this.tiles.length).fill(0);

    const eligibleToDie = this.tiles.filter(tile =>
        tile.getState() === TileState.ALIVE && (this.numNeighborsPerTile[tile.getId()] <= 1 || this.numNeighborsPerTile[tile.getId()] >= 4)
      );


    const eligibleToBorn = this.tiles.filter(tile =>
        tile.getState() !== TileState.ALIVE && this.numNeighborsPerTile[tile.getId()] === 3
      );

      if (eligibleToBorn.length === 0 && eligibleToDie.length === 0){
        this.openSteadyStateSnackbar();
      }


    for(const tile of eligibleToDie){
      const neighborsIds = this.getNeighbors(tile.getId());
      tile.die();
      for (const id of neighborsIds){
        variations[id] -= 1;
      }
      this.tiles[tile.getId()] = tile;
    }

    for(const tile of eligibleToBorn){
      const neighborsIds = this.getNeighbors(tile.getId());
      tile.born();
      for (const id of neighborsIds){
        variations[id] += 1;
      }
      this.tiles[tile.getId()] = tile;
    }

    for(let id = 0; id < this.tiles.length; id++){
      this.numNeighborsPerTile[id] += variations[id];
    }

  }

  public increaseDimension(){
    this.dimension += 5;
  }

  public decreaseDimension(){
    this.dimension -= 5;
  }

  private setDimension(newDimension: number){
    this.dimension = newDimension;
  }


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
    ].filter( tileId => tileId >= 0 && tileId < this.dimension * this.dimension);

    if(id % this.dimension === 0){
      // FIRST COLUMN CASE
        neighborhood =
            neighborhood.filter( tileId => tileId !== id - this.dimension -1 && tileId !== id - 1 && tileId !== id + this.dimension -1);
    } else if (id % this.dimension === this.dimension -1){
        // LAST COLUMN CASE
      neighborhood =
        neighborhood.filter( tileId => tileId !== id - this.dimension +1 && tileId !== id+1 && tileId !== id + this.dimension+1);
    }
    return neighborhood;
  }

  /**
   * Updates, for all the tiles that border on the specified one, the neighborhood statistics.
   * @param tile The tile that borders the tiles to update.
   */
  private updateNeighbors(tile: Tile): void{
    const neighborsIds = this.getNeighbors(tile.getId());
    if (tile.getState() === TileState.ALIVE){
      for ( const id of neighborsIds){
        this.numNeighborsPerTile[id] += 1;
      }
    } else{
      for(const id of neighborsIds){
        this.numNeighborsPerTile[id] -= 1;
      }
    }
  }

  /**
   *  Opens a snackbar that warns the user that the grid has reached a steady state.
   */
  private openSteadyStateSnackbar(): void{
    const message = this.simulation.isPlayed() ? 'The game of life has reached a steady state. Simulation has been stopped.' : 'The game of life has reached a steady state.';
    this.steadyStateSnackbar.open(message, null , {
      duration: 3000
    });
    this.pauseSimulation();

  }

}
