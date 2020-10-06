import { TileState } from './TileState';

export class Tile {
    private id: number;
    private previousState: TileState;
    private state: TileState;
    private births: number;
    private deaths: number;
    //private neighborsStates: TileState[]



    constructor(id:number,state?:TileState,births?:number, deaths?: number){
        this.id = id;
        this.state = state? state: TileState.EMPTY;
        this.births = births? births : 0;
        this.deaths = deaths? deaths : 0;
    }

    public born(){
        if(this.state === TileState.EMPTY){
            this.state = TileState.ALIVE;
            this.births +=1;
        }
    }

    public die(){
        if(this.state === TileState.ALIVE){
            this.setState(TileState.DEAD);
            this.deaths += 1;
        }
    }

    public getId(){
        return this.id;
    }

    public computeNextState(neighbors: Tile[]){
        this.previousState = this.state;
        const aliveNeighbors = neighbors.filter(tile => tile.getState() === TileState.ALIVE).length;
        switch(this.state){
            case TileState.ALIVE:{
                if (aliveNeighbors <=1 && aliveNeighbors >= 4){
                    this.die();
                }
                break;
            }
            case TileState.EMPTY:{
                if(aliveNeighbors === 3){
                    this.born();
                }
                break;
            }
            case TileState.DEAD: {
                this.state = TileState.EMPTY;
                break;
            }
        }

    }

    public getState(){
        return this.state;
    }

    public setState(state:TileState){
        this.state = state;
    }

    public getPreviousState(){
        return this.previousState;
    }

    public getBirths(): number{
        return this.births;
    }

    private setBirths(births: number) {
        this.births = births;
    }

    public getDeaths(){
        return this.deaths;
    }

    private setDeaths(deaths: number){
        this.deaths = deaths;
    }

    public isAlive(): boolean {
        if(this.getState() === TileState.ALIVE){
            return true;
        } else{
            return false;
        }
    }



}