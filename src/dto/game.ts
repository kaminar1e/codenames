import { WordService } from "src/services/word.service";
import { GameMode } from "./game_mode";
import { Words } from "./words";




export class Game {
    public words: Words;
    public picked_words: number[];
    public state: number;
    public score: number[];
    public mode: GameMode;
  
    constructor(public gm: GameMode) {
        this.mode = gm;
        this.picked_words = [];
        this.state = 0;
        this.score = [0, 0];
    }

}
