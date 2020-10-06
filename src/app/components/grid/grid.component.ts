import { Simulation } from './../../model/Simulation';
import { TileState } from './../../model/TileState';
import { Tile } from './../../model/Tile';
import { Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit{

  dimension: number;
  tiles: Tile[];
  numNeighborsPerTile: number[];
  tileStateEnum = typeof TileState;
  simulation: Simulation;


  constructor() { }

  ngOnInit(): void {
    if (!this.dimension) {
      this.dimension = 5;
    }

    this.tiles = new Array(this.dimension *  this.dimension);
    this.numNeighborsPerTile = new Array(this.dimension * this.dimension);

    for(let id = 0; id < this.dimension * this.dimension; id++){
      this.tiles[id] = new Tile(id);
      this.numNeighborsPerTile[id] = 0;
    }

    this.simulation = new Simulation();
  }

  public onTileClick(tile: Tile){
    if(tile.getState() !== TileState.ALIVE){
      tile.setState(TileState.ALIVE);
      this.updateNeighbors(tile);
    } else {
      tile.setState(TileState.EMPTY);
      this.updateNeighbors(tile);
    }
    console.log(this.numNeighborsPerTile);
  }

  public computeNextGlobalState(): void{
    let variations = new Array(this.tiles.length).fill(0);

    let eligibleToDie = this.tiles.filter(tile =>
        tile.getState() === TileState.ALIVE && (this.numNeighborsPerTile[tile.getId()] <= 1 || this.numNeighborsPerTile[tile.getId()] >= 4)
      );

    console.log(eligibleToDie);

    let eligibleToBorn = this.tiles.filter(tile =>
        tile.getState() !== TileState.ALIVE && this.numNeighborsPerTile[tile.getId()] === 3
      );

    console.log(eligibleToBorn);

    for(let tile of eligibleToDie){
      const neighborsIds = this.getNeighbors(tile.getId());
      tile.die();
      for (const id of neighborsIds){
        variations[id] -= 1;
      }
    }

    for(let tile of eligibleToBorn){
      const neighborsIds = this.getNeighbors(tile.getId());
      tile.born();
      for (const id of neighborsIds){
        variations[id] += 1;
      }
    }

    this.numNeighborsPerTile = this.numNeighborsPerTile.map((number,id) =>{
      return number + variations[id];
    });
    
    console.log(this.numNeighborsPerTile);
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
   *
   * @param id id number of a target tile
   * @returns array of ids of the neighbors
   */
  private getNeighbors(id: number): number[] {
    /* LEGEND:
    |  id - this.dimension - 1   |    id - this.dimension  |  id - this.dimension + 1  |
    |----------------------------|-------------------------|---------------------------|
    |         id - 1             |         id              |        id + 1             |
    |----------------------------|-------------------------|---------------------------|
    |  id + this.dimension - 1   |  id + this.dimension    |  id + this.dimension + 1  |
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

}
