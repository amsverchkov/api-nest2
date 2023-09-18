import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { IdValidationPipe } from 'src/common/pipes/id-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CreateRoomDto } from './dto/create-room.dto';
import { FindRoomDto } from './dto/find-room.dto';
import { ROOM_NOT_FOUND } from './room.constants';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

	@UsePipes(new ValidationPipe())
	@Roles(Role.Admin)
	@Post('create')
	async create(@Body() dto: CreateRoomDto) {
		return await this.roomService.create(dto);
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		const deletedDoc = await this.roomService.delete(id);
		if (!deletedDoc) {
			throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}

	@UseGuards(RolesGuard)
	@UseGuards(JwtAuthGuard)
	@Roles(Role.Admin)
	@Get(':id')
	async findById(@Param('id', IdValidationPipe) id: string) {
		return await this.roomService.findById(id);
	}

	@UsePipes(new ValidationPipe())
	@Post('findWithSchedules')
	async findWithSchedules(@Body() dto: FindRoomDto) {
		return await this.roomService.findWithSchedules(dto);
	}

	@Get('findGroupedByMonth/:month')
	async findGroupedByMonth(@Param('month') month: string) {
		return await this.roomService.findGroupedByMonth(month);
	}
}
