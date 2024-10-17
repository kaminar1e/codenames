import { Injectable } from '@nestjs/common';

import { WordService } from './word.service';
import { GameMode } from 'src/dto/game_mode';
import { Game } from 'src/dto/game';

@Injectable()
export class GameService {
    constructor(private readonly wordService: WordService) { }

    async create_game(): Promise<Game> {
        let game = new Game(new GameMode(2, 8, 24));
        game.words = await this.wordService.generate(game.mode);
        return game;
    }

    async start(game: Game): Promise<Game> {
        game.state = 1;
        return game;
    }

    async end(game: Game): Promise<Game> {
        game.state = 2;
        return game;
    }

    async increment_score(game: Game, team: number): Promise<Game> {
        team == 0 ? game.score[0]++ : game.score[1]++;
        return game;
    }
    async pick_word(game: Game, word: string, team: number): Promise<Game | void> {
        if (word == game.words.black) {
            this.end(game);
        } else if (game.words.red.includes(word)) {
            // placeholder for win/lose scenario
            if (team == 0) {
                console.log('win');
            } else {
                console.log('lose');
            }
        }
    }
}
