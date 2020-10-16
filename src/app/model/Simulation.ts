export class Simulation{
    private time: number;
    speed: number;
    private played: boolean;
    private intervalId: number;

    constructor(speed?: number){
        this.time = 0;
        this.speed = speed ? speed : 1;
        this.played = false;
        this.intervalId = null;
    }

    public increaseTime(){
        this.time += 1;
    }

    public resetTime(){
        this.time = 0;
    }

    public getTime(): number {
        return this.time;
    }

    public getSpeed(): number {
        return this.speed;
    }

    public setSpeed(speed: number) {
        this.speed = speed;
    }

    public isPlayed(): boolean {
        return this.played;
    }

    public setPlayed(played: boolean) {
        this.played = played;
    }

    public getIntervalId(): number{
        return this.intervalId;
    }

    public setIntervalId(intervalId: number): void{
        this.intervalId = intervalId;
    }

}