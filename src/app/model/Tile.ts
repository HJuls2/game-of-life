import { TileState } from './TileState';

export class Tile {
    private id: number;
    private state: TileState;
    lifeTime: number;

    constructor(id:number,state?:TileState){
        this.id = id;
        this.state = state? state: TileState.EMPTY;
        this.lifeTime = state === TileState.ALIVE ? 1 : 0;
    }

    public born(){
            this.state = TileState.ALIVE;
    }

    public die(){
            this.state = TileState.DEAD;
            this.resetLifeTime();
    }

    public getId(){
        return this.id;
    }

    public getState(){
        return this.state;
    }

    public setState(state:TileState){
        this.state = state;
    }

    public isAlive(): boolean {
        return this.getState() === TileState.ALIVE;
    }

    public getLifeTime(): number{
        return this.lifeTime;
    }

    public setLifeTime(lifeTime: number){
        this.lifeTime = lifeTime;
    }

    public increaseLifeTime(): void{
        this.lifeTime += 1;
    }

    public resetLifeTime(): void{
        this.lifeTime = 0;
    }

    



}