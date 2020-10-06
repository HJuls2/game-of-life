export class Simulation{
    private _time: number;
    private _speed: number;
    private _isPlayed: boolean;

    constructor(speed?: number){
        this.time = 0;
        this.speed = speed ? speed : 1;
        this.isPlayed = false;
    }

    public get time(): number {
        return this._time;
    }
    public set time(value: number) {
        this._time = value;
    }

    public get speed(): number {
        return this._speed;
    }
    public set speed(value: number) {
        this._speed = value;
    }

    public get isPlayed(): boolean {
        return this._isPlayed;
    }
    public set isPlayed(value: boolean) {
        this._isPlayed = value;
    }

}