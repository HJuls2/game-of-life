import { TileState } from './../../model/TileState';
import { Tile } from './../../model/Tile';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ConditionalExpr } from '@angular/compiler';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, OnChanges {

  @Input() dimension: number;
  tiles: Tile[] = [];
  time = 0;


  constructor() { }

  ngOnInit(): void {
    if (!this.dimension) {
      this.dimension = 5;
    }
    for(let id = 0; id < this.dimension * this.dimension; id++){
      this.tiles.push(new Tile(id));
    }

    this.computeNextGlobalState()
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

      for (let neighbor of neighbors){
        neighbor.computeNextState(neighbors);
      }

    });
  }

  private getNeighbors(id: number): Tile[]{
    /* LEGEND:
        --> UPPER LEFT TILE     : id - this.dimension -1,
        --> UPPER CENTRAL TILE  : id - this.dimension,
        --> UPPER RIGHT TILE    : id - this.dimension + 1,
        --> LEFT TILE           : id - 1,
        --> RIGHT TILE          : id + 1,
        --> LOWER LEFT TILE     : id + this.dimension - 1,
        --> LOWER CENTRAL TILE  : id + this.dimension,
        --> LOWER RIGHT TILE    : id + this.dimension + 1
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
    ]

    console.log(neighborhood);

    switch(id % this.dimension){
      // FIRST COLUMN CASE
      case 0:{
        neighborhood.filter( tileId => tileId !== id-1 && tileId !== id - this.dimension-1);
        break;
      }
      // LAST COLUMN CASE
      case this.dimension-1: {
        neighborhood.filter( tileId => tileId !== id+1 && tileId !== id + this.dimension+1);
        break;
      }
    }

    if(id < this.dimension){ // FIRST ROW CASE
      // Filter the neighborhood taking all UPPER tiles
      neighborhood.filter( tileId => [ id - this.dimension - 1, id - this.dimension, id - this.dimension +1].indexOf(tileId) > -1);
    } else if( id >= this.tiles.length - this.dimension && id < this.tiles.length){ // LAST ROW CASE
      // Filter the neighborhood taking all LOWER tiles
      neighborhood.filter( tileId => [id + this.dimension-1, id + this.dimension, id + this.dimension+1]);
    }

    for( const neighbor of neighborhood){
      console.log(`TILE ID: ${id}; NEIGHBOR: ${neighbor}`);
    }

    // Return all tiles with the neighborhood IDs
    return this.tiles.filter((neighbor:Tile) => neighborhood.indexOf(neighbor.getId()) > -1 );

  }

}
