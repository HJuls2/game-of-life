export class Simulation{
    private _time: number;
    public  _speed: number;
    private _played: boolean;
    private _intervalId: number;

    constructor(speed?: number){
        this._time = 0;
        this._speed = speed ? speed : 1;
        this._played = false;
        this._intervalId = null;
    }

    public increaseTime(){
        this._time += 1;
    }

    public resetTime(){
        this._time = 0;
    }

    /* ----- Getters and Setters ---- */

    public get time(): number {
        return this._time;
    }

    public get speed(): number {
        return this._speed;
    }

    public set speed(speed: number) {
        this._speed = speed;
    }

    public isPlayed(): boolean {
        return this._played;
    }

    public set played(played: boolean) {
        this._played = played;
    }

    public get intervalId(): number{
        return this._intervalId;
    }

    public set intervalId(intervalId: number){
        this._intervalId = intervalId;
    }

}