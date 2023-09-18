import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateScheduleDto {
	@IsString()
	room: string;
	@IsDate()
	day: Date;
	@IsOptional()
	@IsString()
	comment?: string;
	@IsOptional()
	@IsString()
	contact?: string;
}
