import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { WordService } from './services/word.service';
import { ConfigService } from './services/config.service';
import { UserService } from './services/user.service';

import { RandomService } from './services/random.service';
import { QueueService } from './services/queue.service';
import { GameService } from './services/game.service';
import { RoomService } from './services/room.service';
import { RoomController } from './controllers/room.controller';


@Module({
  imports: [],
  controllers: [AppController, RoomController],
  providers: [AppService, WordService, ConfigService, UserService, RoomService, RandomService, QueueService, GameService],
})
export class AppModule {}
