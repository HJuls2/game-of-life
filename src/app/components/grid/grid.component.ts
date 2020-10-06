import { Simulation } from './../../model/Simulation';
import { TileState } from './../../model/TileState';
import { Tile } from './../../model/Tile';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ConditionalExpr } from '@angular/compiler';
import { type } from 'os';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, OnChanges {

  dimension: number;
  tiles: Tile[];
  neighbors: number[];
  tileStateEnum = typeof TileState;
  simulation: Simulation;


  constructor() { }

  ngOnInit(): void {
    if (!this.dimension) {
      this.dimension = 5;
    }

    this.tiles = new Array(this.dimension *  this.dimension);
    this.neighbors = new Array(this.dimension * this.dimension);

    for(let id = 0; id < this.dimension * this.dimension; id++){
      this.tiles[id] = new Tile(id);
      this.neighbors[id] = 0;
    }

    this.simulation = new Simulation();

    //this.computeNextGlobalState()
  }

  ngOnChanges():void {
    this.computeNextGlobalState();
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

  public computeNextGlobalState(){
    this.tiles.forEach( tile => {
      // Copy all neighbors in a support vector
      const neighbors = Object.assign([],this.getNeighbors(tile.getId()));

      for (const neighbor of neighbors){
        neighbor.computeNextState(neighbors);
      }

    });
  }

  /**
   * 
   * @param id id number of a target tile
   * @returns array of ids of the neighbors 
   */
  private getNeighbors(id: number): number[] {
    /* LEGEND:
    |  id - this.dimension - 1    id - this.dimension   id - this.dimension + 1  |
    |                                                                            |
    |         id - 1                    id                    id + 1             |
    |                                                                            |
    | id + this.dimension - 1    id + this.dimension    id + this.dimension + 1  |
    */

    // Take all neighbors candidates IDs
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
    //return this.tiles.filter((neighbor:Tile) => neighborhood.includes(neighbor.getId()));

  }

  public onTileClick(tile: Tile){
    const neighborsIds = this.getNeighbors(tile.getId());

    if(tile.getState() !== TileState.ALIVE){
      tile.setState(TileState.ALIVE);
      for ( const id of neighborsIds){
        this.neighbors[id] += 1;
      }
    } else {
      tile.setState(TileState.EMPTY);
      for(const id of neighborsIds){
        this.neighbors[id] -= 1;
      }
    }
    console.log(this.neighbors);
  }

}
