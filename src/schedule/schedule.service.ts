import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleModel } from './schedule.model';

@Injectable()
export class ScheduleService {
	constructor(@InjectModel(ScheduleModel.name) private scheduleModel: Model<ScheduleModel>) {}

	async getByRoomIdAndDate(roomId: string, date: Date): Promise<ScheduleModel[] | null> {
		return this.scheduleModel.find({ roomId: new Types.ObjectId(roomId), date: date }).exec();
	}

	async create(dto: CreateScheduleDto): Promise<ScheduleModel> {
		return await new this.scheduleModel(dto).save();
	}

	async delete(id: string): Promise<ScheduleModel> | null {
		return this.scheduleModel.findByIdAndDelete(id).exec();
	}

	async searchByComment(text: string) {
		return await this.scheduleModel
			.find({
				$text: {
					$search: text,
					$caseSensitive: false,
				},
			})
			.exec();
	}
}
