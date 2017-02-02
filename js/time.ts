export class Time {
    private startTime: number;
    private timeStarted: boolean;
    private stoppedTime: number;
    private timescale: number;

    constructor() {
        this.timescale = 1;
        this.StartTime();
    }

    Get() {
        return this.timeStarted ? new Date().getTime() * this.timescale - this.startTime : this.stoppedTime;
    };

    StartTime() {
        this.startTime = new Date().getTime() * this.timescale;
        this.timeStarted = true;
    };

    StopTime() {
        this.stoppedTime = new Date().getTime() * this.timescale;
        this.timeStarted = false;
    };
}
