import { Injectable } from '@nestjs/common';
import { WordsConfig } from 'src/dto/words_config';
import { promises as fs } from 'fs';

@Injectable()
export class ConfigService {
    async read(subject: string): Promise<WordsConfig> {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await fs.readFile('../data/config.json');
                const config: JSON = await JSON.parse(String(data));
                return resolve(config[subject] || {})
            } catch (error) {
                console.log(`ERROR: ${error}`);
            }
        })
    }
}
