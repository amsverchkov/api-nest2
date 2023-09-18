import { IsArray, IsEnum, IsNumber } from 'class-validator';
import { FileModel } from 'src/files/file-model';
import { RoomType } from '../room.model';

export class CreateRoomDto {
	@IsNumber()
	number: number;
	@IsEnum(RoomType)
	type: RoomType;
	@IsArray()
	file: FileModel[];
}
