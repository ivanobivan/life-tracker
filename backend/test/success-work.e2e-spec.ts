import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Test application in user scenario', () => {
    let app: INestApplication;
    let token: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('sign in', () => {
        return request(app.getHttpServer())
            .post('/auth/signUp')
            .send({
                "name": "test",
                "password": "12345",
                "email": "test.test@gmail.com"
            })
            .expect(200)
            .end((err, res) => {
                token = res.body.token
            });
    });

    it('get user', () => {
        return request(app.getHttpServer())
            .get('/api/v1/user')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect({
                name: ''
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
