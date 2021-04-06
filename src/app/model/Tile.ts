import { TileState } from './TileState';

export class Tile {
    private _id: number;
    private _state: TileState;
    private _lifeTime: number;

    constructor(id:number,state?:TileState){
        this._id = id;
        this._state = state? state: TileState.EMPTY;
        this._lifeTime = state === TileState.ALIVE ? 1 : 0;
    }

    public reset(){
        this._state = TileState.EMPTY;
        this.resetLifeTime();
    }

    public born(){
            this._state = TileState.ALIVE;
            this.increaseLifeTime();
    }

    public die(){
            this._state = TileState.DEAD;
            this.resetLifeTime();
    }

    public increaseLifeTime(): void{
        this._lifeTime += 1;
    }

    public resetLifeTime(): void{
        this._lifeTime = 0;
    }

    /* ---- Getters and Setters -----*/

    public get id(){
        return this._id;
    }

    public get state(){
        return this._state;
    }

    public set state(state:TileState){
        this._state = state;
    }

    public isAlive(): boolean {
        return this._state === TileState.ALIVE;
    }

    public get lifeTime(): number{
        return this._lifeTime;
    }

    public set lifeTime(lifeTime: number){
        this._lifeTime = lifeTime;
    }




}