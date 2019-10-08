class WavePattern extends Pattern{
    constructor () {
        super();

    }

    getTilts(x,y) {
        let tilts = {}
        tilts.rx = Math.sin(x + y + 0.001* this.time_ms)
        tilts.ry = Math.sin(x + y + 0.001* this.time_ms )
        return tilts;
    }

    update(dt_time_ms) {
        this.time_ms += dt_time_ms
    }

    died() {
        return false;
    }
}