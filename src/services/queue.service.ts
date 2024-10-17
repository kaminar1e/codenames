import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { RoomRequest } from 'src/dto/room_request';

@Injectable()
export class QueueService extends EventEmitter {
    private list: RoomRequest[] = [];
    private isProcessing: boolean;
    constructor() {
        super();
        this.on('process', this.processQueue.bind(this));
    }

    async addRequest(req: RoomRequest): Promise<boolean> {
        try {
            this.list.push(req);

            if (!this.isProcessing) this.emit('process'); // enable queue processing

            return true;
        } catch (error) {
            return false;
        }
    }

    private async processQueue(): Promise<void> {
        this.isProcessing = true;
        // check is queue currently processing
        if (this.list.length === 0) {
            this.isProcessing = false;
            return;
        }
        // get first element of queue
        const request = this.list.shift();
        if (request) {
            await request.callback(); // perform callback
        }

        // if queue still have elements, continue processing
        if (this.list.length > 0) {
            this.emit('process');
        } else {
            this.isProcessing = false;
        }
    }
}
