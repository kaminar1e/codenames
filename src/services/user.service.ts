import { Injectable } from '@nestjs/common';
import { User } from 'src/dto/user';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
    async create(user_id: number, role: number, nickname: string, ip_addr: string, team: number): Promise<User> {
        return plainToInstance(User, { user_id, role, nickname, ip_addr, team });
    }
    async changeNickname(user: User, new_nickname: string): Promise<User> {
        user.nickname = new_nickname;
        return user;
    }

    async changeRole(user: User, new_role: number): Promise<User> {
        user.role = new_role;
        return user;
    }
}
