import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
@Injectable()
export class RandomService {
    getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getCryptoRandomInt(max: number) {
        const randomBytes = crypto.randomBytes(1);
        return Math.floor(randomBytes[0] / 255 * (max));
    }
}
