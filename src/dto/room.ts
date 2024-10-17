import { Game } from "./game";
import { User } from "./user";

export class Room {
    public id: number;
    public slots_number: number;
    public password?: string;
    public joined_players: User[] = [];
    public can_new_users_join_team: boolean = true;
    public game: Game;
}
