import { IsString } from 'class-validator';

export class SaveFilesDto {
	@IsString()
	url: string;
	@IsString()
	name: string;
}
