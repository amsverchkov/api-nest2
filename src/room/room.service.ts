import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ScheduleModel } from 'src/schedule/schedule.model';
import { CreateRoomDto } from './dto/create-room.dto';
import { FindRoomDto } from './dto/find-room.dto';
import { RoomDocument, RoomModel } from './room.model';

@Injectable()
export class RoomService {
	constructor(@InjectModel(RoomModel.name) private readonly roomModel: Model<RoomDocument>) {}

	async create(dto: CreateRoomDto): Promise<RoomModel> {
		return new this.roomModel(dto).save();
	}

	async delete(id: string): Promise<RoomModel> | null {
		return this.roomModel.findByIdAndDelete({ _id: id }).exec();
	}

	findById(id: string): Promise<RoomModel[]> {
		return this.roomModel.find({ _id: new Types.ObjectId(id) }).exec();
	}

	async findAll(): Promise<RoomModel[]> {
		return this.roomModel.find().exec();
	}

	async findWithSchedules(dto: FindRoomDto) {
		return this.roomModel
			.aggregate([
				{
					$match: {
						type: dto.type,
					},
				},
				{
					$sort: {
						_id: 1,
					},
				},
				{
					$limit: dto.limit,
				},
				{
					$lookup: {
						from: 'schedulemodels',
						localField: '_id',
						foreignField: 'room',
						as: 'schedules',
					},
				},
				{
					$addFields: {
						scheduleCount: {
							$size: '$schedules',
						},
						schedules: {
							$function: {
								body: `function (schedules) {
									schedules.sort((a, b) => new Date(b.day) - new Date(a.day));
									return schedules;
								}`,
								args: ['$schedules'],
								lang: 'js',
							},
						},
					},
				},
			])
			.exec() as Promise<RoomModel & { schedule: ScheduleModel[]; scheduleCount: number }[]>;
	}

	async findGroupedByMonth(
		month: string,
	): Promise<(RoomModel & { schedules: ScheduleModel[]; schedulesCount: number })[]> {
		const monthDt = new Date(month);
		const startDate = new Date(monthDt.getFullYear(), monthDt.getMonth(), 1);
		const lastDate = new Date(monthDt.getFullYear(), monthDt.getMonth() + 1, 1);
		return this.roomModel
			.aggregate([
				{
					$sort: {
						_id: 1,
					},
				},
				{
					$lookup: {
						from: 'schedulemodels',
						localField: '_id',
						foreignField: 'room',
						as: 'schedules',
						pipeline: [
							{
								$match: {
									day: { $gte: startDate, $lt: lastDate },
								},
							},
						],
					},
				},
				{
					$addFields: {
						schedulesCount: { $size: '$schedules' },
					},
				},
			])
			.exec() as Promise<(RoomModel & { schedules: ScheduleModel[]; schedulesCount: number })[]>;
	}
}
