import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpStatus } from '@nestjs/common';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestModule } from './test.module';

describe('UserController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER)
    testService = app.get(TestService)
  });

  
  describe('POST /api/users/register', () => {
    beforeEach(async () => {
      await testService.deleteAll()
    })

    it('should rejected with bad request', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          username: '',
          name: '',
          password: '',
        })

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res.body.errors).toBeDefined();
    });

    it('should be able to register', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          username: 'test',
          name: 'test',
          password: 'test',
        })

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.CREATED);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.username).toEqual('test');
      expect(res.body.data.name).toEqual('test');
    });

    it('should be rejected if username already exists', async () => {
      await testService.createUser()
      const res = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          username: 'test',
          name: 'Test',
          password: 'password',
        })

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(res.body.error).toBeDefined();
    });
  })

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await testService.deleteAll()
    })

    it('should rejected with bad request', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: '',
          password: '',
        })

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res.body.errors).toBeDefined();
    });

    it('should be able to login', async () => {
      await testService.createUser()
      const res = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'password',
        })

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.name).toBeDefined();
      expect(res.body.data.username).toEqual('test');
    });

    it('should be rejected if credentials are wrong', async () => {
      await testService.createUser()
      const res = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'salah',
        })

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
      expect(res.body.error).toBeDefined();
    });
  })

  describe('GET /api/users/current', () => {
    beforeEach(async () => {
      await testService.deleteAll()
      await testService.createUser()
    })

    it('should rejected with bad request', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('Authorization', 'wrong')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
      expect(res.body.error).toBeDefined();
    });

    it('should be able to get auth user', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.name).toBeDefined();
      expect(res.body.data.username).toEqual('test');
    });
  })

  describe('PATCH /api/users/current', () => {
    beforeEach(async () => {
      await testService.deleteAll()
      await testService.createUser()
    })

    it('should rejected with bad request', async () => {
      const res = await request(app.getHttpServer())
        .patch('/api/users/current')
        .send({
          name: '',
          password: '',
        })
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res.body.errors).toBeDefined();
    });

    it('should be able update name', async () => {
      const res = await request(app.getHttpServer())
        .patch('/api/users/current')
        .send({
          name: 'test updated',
        })
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.name).toEqual('test updated');
      expect(res.body.data.username).toEqual('test');
    });

    it('should be able update password', async () => {
      const resUpdate = await request(app.getHttpServer())
        .patch('/api/users/current')
        .send({
          password: 'new_password',
        })
        .set('Authorization', 'test')

      logger.info(resUpdate.body)
      expect(resUpdate.status).toEqual(HttpStatus.OK);
      expect(resUpdate.body.data.username).toEqual('test');
      expect(resUpdate.body.data.name).toEqual('Test');

      const resLogin = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'new_password',
        })
      expect(resLogin.status).toEqual(HttpStatus.OK);
      expect(resLogin.body.data.token).toBeDefined();
    });
  })

  describe('DELETE /api/users/logout', () => {
    beforeEach(async () => {
      await testService.deleteAll()
      await testService.createUser()
    })

    it('should rejected with bad request', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/users/logout')
        .set('Authorization', 'wrong')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
      expect(res.body.error).toBeDefined();
    });

    it('should be able to logout user', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/users/logout')
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body.data).toBe(true);
    });
  })
});
