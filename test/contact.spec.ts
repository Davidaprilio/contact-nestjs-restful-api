import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpStatus } from '@nestjs/common';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestModule } from './test.module';

describe('ContactController', () => {
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

  
  describe('POST /api/contacts', () => {
    beforeEach(async () => {
      await testService.deleteContacts()
      await testService.deleteUser()

      await testService.createUser()
    })

    it('should rejected with bad request', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/contacts')
        .send({
          first_name: '', 
          last_name: '',
          email: '',
          phone: '',
        })
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res.body.errors).toBeDefined();
    });

    it('should be able to create contact', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/contacts')
        .send({
          first_name: 'test',
          last_name: 'test',
          email: 'test@example.com',
          phone: '08123456789',
        })
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.CREATED);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.first_name).toEqual('test');
      expect(res.body.data.last_name).toEqual('test');
      expect(res.body.data.email).toEqual('test@example.com');
      expect(res.body.data.phone).toEqual('08123456789');
    });
  })

  describe('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContacts()
      await testService.deleteUser()

      const user = await testService.createUser()
      await testService.createContact(user.id)
    })

    it('should be rejected if contact is not found', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/contacts/0')
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.NOT_FOUND);
      expect(res.body.error).toBeDefined();
    });

    it('should be able to get contact', async () => {
      const contacts = await testService.getContacts()
      const res = await request(app.getHttpServer())
        .get('/api/contacts/' + contacts[0].id)
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body.data.id).toBe(contacts[0].id);
      expect(res.body.data.first_name).toEqual('test');
      expect(res.body.data.last_name).toEqual('test');
      expect(res.body.data.email).toEqual('test@example.com');
      expect(res.body.data.phone).toEqual('08123456789');
    });
  })

  describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContacts()
      await testService.deleteUser()

      const user = await testService.createUser()
      await testService.createContact(user.id)
    })

    it('should be rejected if contact is not found', async () => {
      const res = await request(app.getHttpServer())
        .put('/api/contacts/100')
        .set('Authorization', 'test')
        .send({
          first_name: 'test',
          last_name: 'test',
          email: 'test@example.com',
          phone: '08123456789',
        })

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.NOT_FOUND);
      expect(res.body.error).toBeDefined();
    });

    it('should be rejected with bad request', async () => {
      const res = await request(app.getHttpServer())
        .put('/api/contacts/100')
        .set('Authorization', 'test')
        .send({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
        })

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res.body.errors).toBeDefined();
    });

    it('should be able to update contact', async () => {
      const contacts = await testService.getContacts()
      const res = await request(app.getHttpServer())
        .put('/api/contacts/' + contacts[0].id)
        .set('Authorization', 'test')
        .send({
          first_name: 'tes',
          last_name: 'update',
          email: 'test_update@example.com',
          phone: '628123456789',
        })

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body.data.id).toBe(contacts[0].id);
      expect(res.body.data.first_name).toEqual('tes');
      expect(res.body.data.last_name).toEqual('update');
      expect(res.body.data.email).toEqual('test_update@example.com');
      expect(res.body.data.phone).toEqual('628123456789');
    });
  })

  describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContacts()
      await testService.deleteUser()

      const user = await testService.createUser()
      await testService.createContact(user.id)
    })

    it('should be rejected if contact is not found', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/contacts/100')
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.NOT_FOUND);
      expect(res.body.error).toBeDefined();
    });

    it('should be able to update contact', async () => {
      const contacts = await testService.getContacts()
      const res = await request(app.getHttpServer())
        .delete('/api/contacts/' + contacts[0].id)
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body.data).toBe(true);
    });
  })

  
  describe('GET /api/contacts', () => {
    beforeEach(async () => {
      await testService.deleteContacts()
      await testService.deleteUser()

      const user = await testService.createUser()
      await testService.createContact(user.id)
    })

    it('should be able to search contact', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/contacts')
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body.data.length).toBe(1);
    });
    
    it('should be able to search contact by name', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/contacts')
        .query({ name: 'test' })
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body.data.length).toBe(1);
    });

    it('should be able to search contact by name not found', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/contacts')
        .query({ name: 'wrong' })
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body.data.length).toBe(0);
    });

    it('should be able to search contact by email', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/contacts')
        .query({ email: 'test' })
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body.data.length).toBe(1);
    });

    it('should be able to search contact by email not found', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/contacts')
        .query({ email: 'wrong' })
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body.data.length).toBe(0);
    });

    it('should be able to search contact by phone', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/contacts')
        .query({ phone: '6789' })
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body.data.length).toBe(1);
    });

    it('should be able to search contact by phone not found', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/contacts')
        .query({ phone: '0000' })
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body.data.length).toBe(0);
    });

    it('should be able to search contact with page', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/contacts')
        .query({ 
          size: 1,
          page: 2,
        })
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body.data.length).toBe(0);
      expect(res.body.paging.current_page).toBe(2);
      expect(res.body.paging.pages).toBe(1);
      expect(res.body.paging.size).toBe(1);
    });
  })

});
