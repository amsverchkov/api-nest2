import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { disconnect } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from '../src/auth/auth.constants';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { Role } from '../src/common/enums/role.enum';

const loginDto: AuthDto = {
	login: 'test@mail.ru',
	password: '12345',
	name: 'Alex',
	phone: 23412434,
	role: Role.Admin,
};

const incorrectEmailLoginDto: AuthDto = {
	login: 'test2@mail.ru',
	password: '123456',
	name: 'Alex',
	phone: 23412434,
	role: Role.Admin,
};

const incorrectPasswordLoginDto: AuthDto = {
	login: 'test@mail.ru',
	password: '123456',
	name: 'Alex',
	phone: 23412434,
	role: Role.Admin,
};

describe('Test of auth', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll((done) => {
		disconnect();
		done();
	});

	it('Test of incorrect login auth', async () => {
		const { body } = await request(app.getHttpServer())
			.post('/auth/login')
			.send(incorrectEmailLoginDto);
		expect(body.message).toContain(USER_NOT_FOUND_ERROR);
	});

	it('Test of incorrect password auth', async () => {
		const { body } = await request(app.getHttpServer())
			.post('/auth/login')
			.send(incorrectPasswordLoginDto);
		expect(body.message).toContain(WRONG_PASSWORD_ERROR);
	});

	it('Test of correct auth', async () => {
		const { body } = await request(app.getHttpServer()).post('/auth/login').send(loginDto);
		expect(body.access_token).toBeDefined();
	});
});
