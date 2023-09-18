import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
} from '@nestjs/common';
import { format } from 'date-fns';
import { TelegramService } from 'src/telegram/telegram.service';
import { ROOM_NOT_FOUND } from '../room/room.constants';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
	constructor(
		private readonly scheduleService: ScheduleService,
		private readonly telegramService: TelegramService,
	) {}

	@Post('create')
	async create(@Body() dto: CreateScheduleDto) {
		try {
			const res = await this.scheduleService.create(dto);
			this.notify(dto);
			return res;
		} catch (e) {
			const err = e as Error;
			return err.message;
		}
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		const deletedDoc = await this.scheduleService.delete(id);
		if (!deletedDoc) {
			throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}

	@Get('searchByComment/:text')
	async searchByComment(@Param('text') text: string) {
		return await this.scheduleService.searchByComment(text);
	}

	@Post('notify')
	async notify(@Body() dto: CreateScheduleDto) {
		let message = `Новое бронирование комнаты ${dto.room} на ${format(
			new Date(dto.day),
			'dd.MM.yyyy',
		)}\n`;
		message = dto.contact ? message + ` Контакт для связи: ${dto.contact}` : message;
		return await this.telegramService.sendMessage(message);
	}
}
