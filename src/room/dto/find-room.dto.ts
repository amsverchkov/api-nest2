import { IsEnum, IsNumber } from 'class-validator';
import { RoomType } from '../room.model';

export class FindRoomDto {
	@IsNumber()
	limit: number;

	@IsEnum(RoomType)
	type: RoomType;
}
