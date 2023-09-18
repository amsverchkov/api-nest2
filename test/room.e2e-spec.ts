import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { disconnect } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { Role } from '../src/common/enums/role.enum';
import { CreateRoomDto } from '../src/room/dto/create-room.dto';
import { RoomType } from '../src/room/room.model';
import { CreateScheduleDto } from '../src/schedule/dto/create-schedule.dto';

const createRoomDto: CreateRoomDto = {
	number: 100,
	type: RoomType.Standard,
};

const createRoomIncorrectDto = {
	number: 101,
	type: 'Strange room',
};

const createScheduleDto: CreateScheduleDto = {
	room: null,
	day: new Date(),
};

const loginDto: AuthDto = {
	login: 'test@mail.ru',
	password: '12345',
	name: 'Alex',
	phone: 23412434,
	role: Role.Admin,
};

describe('Room and Schedule modules (e2e)', () => {
	let app: INestApplication;
	let token: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		const { body } = await request(app.getHttpServer()).post('/api/auth/login').send(loginDto);
		token = body.access_token;
	});

	afterAll((done) => {
		disconnect();
		done();
	});

	let createdRoomId: string | null;

	const createRoomRoute = `/room/create`;

	it(`createRoom createSchedule deleteSchedule deleteRoom`, async () => {
		const createRoomRes = await request(app.getHttpServer())
			.post(createRoomRoute)
			.set('Authorization', 'Bearer ' + token)
			.send(createRoomDto)
			.expect(201);
		createdRoomId = createRoomRes.body._id;
		expect(createdRoomId).toBeDefined();
		createScheduleDto.room = createdRoomId;

		const createScheduleRes = await request(app.getHttpServer())
			.post(`/schedule/create`)
			.send(createScheduleDto)
			.set('Authorization', 'Bearer ' + token)
			.expect(201);
		const createdScheduleId = createScheduleRes.body._id;
		expect(createdScheduleId).toBeDefined();

		await request(app.getHttpServer())
			.delete(`/schedule/${createdScheduleId}`)
			.set('Authorization', 'Bearer ' + token)
			.expect(200);
		await request(app.getHttpServer())
			.delete(`/room/${createdRoomId}`)
			.set('Authorization', 'Bearer ' + token)
			.expect(200);
	});

	it(`createRoom incorrect dto (POST)`, (done) => {
		request(app.getHttpServer())
			.post(createRoomRoute)
			.send(createRoomIncorrectDto)
			.expect(400)
			.then(() => {
				done();
			})
			.catch(() => done());
	});
});
