import { Injectable } from '@nestjs/common';
import { Words } from 'src/dto/words';
import { ConfigService } from './config.service';
import { promises as fs } from 'fs';
import { plainToInstance } from 'class-transformer';
import { RandomService } from './random.service';
import { GameMode } from 'src/dto/game_mode';
@Injectable()
export class WordService {
    constructor(private readonly config: ConfigService, private readonly random: RandomService) { }



    async readAllWords(difficulty?: string): Promise<string[]> {
        try {
            const data = await fs.readFile('../data/words.json');
            const allWords: JSON = await JSON.parse(String(data));
            return difficulty ? allWords[difficulty] || [] : allWords;
        } catch (error) {
            console.log(`ERROR: ${error}`);
            return [];
        }
    }

    async generate(mode: GameMode): Promise<Words> {
        const words = await this.readAllWords('easy');
        // const conf = await this.config.read('words');
        if (mode) {

            let red: string[] = [];
            let blue: string[] = [];
            let grey: string[] = [];
            let black: string = '';
            let usedIndexes: number[] = [];

            for (let i = 0; i < mode.words_amount; i++) {
                let word_index = this.random.getRandomInt(0, words.length - 1);
                while (usedIndexes.includes(word_index)) {
                    word_index = this.random.getRandomInt(0, words.length - 1);
                }
                usedIndexes.push(word_index);
            }

            for (let i = 0; i < usedIndexes.length - 1; i++) {
                if (!black) {
                    black = words[usedIndexes[i]];
                } else if (red.length < mode.points_to_win) {
                    red.push(words[usedIndexes[i]]);
                } else if (blue.length < mode.points_to_win) {
                    blue.push(words[usedIndexes[i]]);
                } else {
                    grey.push(words[usedIndexes[i]]);
                }
            }
            return plainToInstance(Words, { red, blue, grey, black });

        } else {
            console.error('Cannot read config');
        }
    }
    async addWords(list: string[], difficulty: string): Promise<boolean> {
        try {
            let words = await this.readAllWords();
            let diff = words[difficulty];
            for (const word of list) {
                diff.push(word);
            }
            words[difficulty] = diff;
            await fs.writeFile('../data/words.json', JSON.stringify(words));
        } catch (error) {
            console.log(`Error on adding words: ${error}`);
            return false;
        }
    }
}
