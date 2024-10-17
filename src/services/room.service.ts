import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Room } from 'src/dto/room';
import { RandomService } from './random.service';
import { QueueService } from './queue.service';
import { RoomRequest } from 'src/dto/room_request';
import { UserService } from './user.service';
import { User } from 'src/dto/user';
import { RoomPublic } from 'src/dto/room_public';

@Injectable()
export class RoomService {

    constructor(private readonly random: RandomService, private readonly queue: QueueService, private readonly users: UserService) { }

    public rooms = new Map();

    async generateRoomId(): Promise<number> {
        const cyphers = '1234567890';
        let plain_id: string = '';
        for (let i = 0; i < 8; i++) {
            plain_id += cyphers[this.random.getCryptoRandomInt(9)];
        }
        return Number(plain_id);
    }

    async create(slots_number: number, password?: string): Promise<string | number> {
        try {
            let id = await this.generateRoomId();
            while (this.rooms.has(id)) {
                id = await this.generateRoomId();
            }
            const room = plainToInstance(Room, { id, slots_number, password });
            await this.queue.addRequest(plainToInstance(RoomRequest, {
                id: id, callback: () => {
                    this.rooms.set(id, room);
                }
            }));
            return id;
        } catch (error) {
            return `Error: ${error}`
        }
    }
    
    async join(room_id: number, nickname: string): Promise<User> {
        const user: User = await this.users.create(0, 1, nickname, '0.0.0.0', 2);
        await this.queue.addRequest(plainToInstance(RoomRequest, {
            id: room_id,
            callback: async () => {
                if (this.rooms.has(room_id)) {
                    let room: Room = this.rooms.get(room_id);

                    user.id = room.joined_players.length;
                    room.joined_players.push(user);
                    this.rooms.set(room_id, room);

                }
            }
        }));
        return user;
    }
    async remove_room(room_id: number) {
        await this.queue.addRequest(plainToInstance(RoomRequest, {
            id: room_id,
            callback: async () => {
                if (this.rooms.has(room_id)) {
                    this.rooms.delete(room_id);
                }
            }
        }))
    }
    async leave(room_id: number, user_id: number) {
        await this.queue.addRequest(plainToInstance(RoomRequest, {
            id: room_id,
            callback: async () => {
                if (this.rooms.has(room_id)) {
                    let room: Room = this.rooms.get(room_id);
                    room.joined_players = room.joined_players.filter(player => player.id !== user_id);
                    this.rooms.set(room_id, room);
                    if (room.joined_players.length === 0) {
                        this.rooms.delete(room_id);
                    }
                }
            }
        }))
    }
    async change_password(room_id: number, password: string) {
        await this.queue.addRequest(plainToInstance(RoomRequest, {
            id: room_id,
            callback: async () => {
                if (this.rooms.has(room_id)) {
                    let room: Room = this.rooms.get(room_id);
                    room.password = password;
                    this.rooms.set(room_id, room);
                }
            }
        }))
    }

    async get_room_users(room_id: number): Promise<User[]> {
        const room: Room = this.rooms.get(room_id);
        return room.joined_players;
    }

    async get_rooms_public(): Promise<RoomPublic[]> {
        let rooms_values = this.rooms.values();
        let rooms: RoomPublic[] = [];
        for (let room of rooms_values) {
            rooms.push(plainToInstance(RoomPublic, { slots_number: room.slots_number, joined_players: room.joined_players }));
        }
        return rooms;
    }

    async get_room_public_info(room_id: number): Promise<RoomPublic> {
        let room: Room = this.rooms.get(room_id);
        let public_room: RoomPublic = plainToInstance(RoomPublic, room);
        return public_room;
    }
}
