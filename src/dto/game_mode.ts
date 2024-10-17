export class GameMode {
    // public id: number;
    public teams: number;
    public points_to_win: number;
    public words_amount: number;

    constructor(tm: number, ptwin: number, wamount: number) {
        this.teams = tm;
        this.points_to_win = ptwin;
        this.words_amount = wamount;
    }
}

