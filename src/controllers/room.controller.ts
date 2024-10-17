import { Body, Controller, Get, Param, Post, Req, Res, ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateRoom } from 'src/dto/create_room';
import { RoomService } from 'src/services/room.service';
@Controller('rooms')
export class RoomController {

    constructor(private readonly rooms: RoomService) { }

    @Post('/create')
    async create_room(@Body(new ValidationPipe({ transform: true, whitelist: true })) body: CreateRoom, @Req() req: Request, @Res() res: Response): Promise<void> {
        let { slots_number, password } = body;
        const room_id = await this.rooms.create(slots_number, password);
        if (room_id) res.redirect(`/rooms/${room_id}`);
    }

    @Get('/join:roomId')
    async join_room(@Param('roomId') roomId: string): Promise<void> {
        
    }
}
