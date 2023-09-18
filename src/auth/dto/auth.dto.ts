import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class AuthDto {
	@IsString()
	login: string;
	@IsString()
	password: string;
	@IsString()
	name: string;
	@IsNumber()
	phone: number;
	@IsEnum(Role)
	role: Role;
}
