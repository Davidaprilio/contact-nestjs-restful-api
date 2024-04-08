import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpStatus } from '@nestjs/common';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestModule } from './test.module';

describe('AddressController', () => {
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

  
  describe('POST /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
      await testService.deleteAddresses()
      await testService.deleteContacts()
      await testService.deleteUser()

      const user = await testService.createUser()
      await testService.createContact(user.id)
    })

    it('should rejected with bad request', async () => {
      const contacts = await testService.getContacts()
      const res = await request(app.getHttpServer())
        .post(`/api/contacts/${contacts[0].id}/addresses`)
        .set('Authorization', 'test')
        .send({
          street: '',
          city: '',
          province: '',
          postal_code: '',
          country: '',
        })

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res.body.errors).toBeDefined();
    });

    it('should be able create address', async () => {
      const contacts = await testService.getContacts()
      const res = await request(app.getHttpServer())
        .post(`/api/contacts/${contacts[0].id}/addresses`)
        .set('Authorization', 'test')
        .send({
          street: 'street test',
          city: 'city test',
          province: 'province test',
          postal_code: '1234',
          country: 'Indonesia',
        })

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.CREATED);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.street).toEqual('street test');
      expect(res.body.data.city).toEqual('city test');
      expect(res.body.data.province).toEqual('province test');
      expect(res.body.data.postal_code).toEqual('1234');
      expect(res.body.data.country).toEqual('Indonesia');
    });

  })

  describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      await testService.deleteAddresses()
      await testService.deleteContacts()
      await testService.deleteUser()

      const user = await testService.createUser()
      const contact = await testService.createContact(user.id)
      await testService.createAddress(contact.id)
    })

    it('should rejected if contact not found', async () => {
      const contacts = await testService.getContacts()
      const address = await testService.getAddresses()
      const res = await request(app.getHttpServer())
        .get(`/api/contacts/${contacts[0].id+1}/addresses/${address[0].id+1}`)
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.NOT_FOUND);
      expect(res.body.error).toBeDefined();
    });

    it('should be able get address', async () => {
      const contacts = await testService.getContacts()
      const address = await testService.getAddresses()
      const res = await request(app.getHttpServer())
        .get(`/api/contacts/${contacts[0].id}/addresses/${address[0].id}`)
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body.data.id).toEqual(address[0].id);
      expect(res.body.data.street).toEqual('street test');
      expect(res.body.data.city).toEqual('city test');
      expect(res.body.data.province).toEqual('province test');
      expect(res.body.data.postal_code).toEqual('1234');
      expect(res.body.data.country).toEqual('country test');
    });

  })

  describe('PUT /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      await testService.deleteAddresses()
      await testService.deleteContacts()
      await testService.deleteUser()

      const user = await testService.createUser()
      const conntact = await testService.createContact(user.id)
      await testService.createAddress(conntact.id)
    })

    it('should rejected with bad request', async () => {
      const contacts = await testService.getContacts()
      const address = await testService.getAddresses()
      const res = await request(app.getHttpServer())
        .put(`/api/contacts/${contacts[0].id}/addresses/${address[0].id}`)
        .set('Authorization', 'test')
        .send({
          street: '',
          city: '',
          province: '',
          postal_code: '',
          country: '',
        })

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res.body.errors).toBeDefined();
    });

    it('should rejected if contact not found', async () => {
      const contacts = await testService.getContacts()
      const address = await testService.getAddresses()
      const res = await request(app.getHttpServer())
        .put(`/api/contacts/${contacts[0].id+1}/addresses/${address[0].id}`)
        .set('Authorization', 'test')
        .send({
          street: 'street test updated',
          city: 'city test updated',
          province: 'province test updated',
          postal_code: '1111',
          country: 'country test updated',
        })

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.NOT_FOUND);
      expect(res.body.error).toBeDefined();
    });

    it('should be able update address', async () => {
      const contacts = await testService.getContacts()
      const address = await testService.getAddresses()
      const res = await request(app.getHttpServer())
        .put(`/api/contacts/${contacts[0].id}/addresses/${address[0].id}`)
        .set('Authorization', 'test')
        .send({
          street: 'street test updated',
          city: 'city test updated',
          province: 'province test updated',
          postal_code: '1111',
          country: 'country test updated',
        })

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.street).toEqual('street test updated');
      expect(res.body.data.city).toEqual('city test updated');
      expect(res.body.data.province).toEqual('province test updated');
      expect(res.body.data.postal_code).toEqual('1111');
      expect(res.body.data.country).toEqual('country test updated');
    });

  })

  describe('DELETE /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      await testService.deleteAddresses()
      await testService.deleteContacts()
      await testService.deleteUser()

      const user = await testService.createUser()
      const conntact = await testService.createContact(user.id)
      await testService.createAddress(conntact.id)
    })

    it('should rejected if contact not found', async () => {
      const contacts = await testService.getContacts()
      const address = await testService.getAddresses()
      const res = await request(app.getHttpServer())
        .delete(`/api/contacts/${contacts[0].id+1}/addresses/${address[0].id}`)
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.NOT_FOUND);
      expect(res.body.error).toBeDefined();
    });

    it('should rejected if address not found', async () => {
      const contacts = await testService.getContacts()
      const address = await testService.getAddresses()
      const res = await request(app.getHttpServer())
        .delete(`/api/contacts/${contacts[0].id}/addresses/${address[0].id+1}`)
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.NOT_FOUND);
      expect(res.body.error).toBeDefined();
    });

    it('should be able delete address', async () => {
      const contacts = await testService.getContacts()
      const address = await testService.getAddresses()
      const res = await request(app.getHttpServer())
        .delete(`/api/contacts/${contacts[0].id}/addresses/${address[0].id}`)
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body.data).toEqual(true);

      const checkAddress = await testService.getAddresses()
      expect(checkAddress.length).toEqual(0);
    });

  })

  describe('GET /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
      await testService.deleteAddresses()
      await testService.deleteContacts()
      await testService.deleteUser()

      const user = await testService.createUser()
      const contact = await testService.createContact(user.id)
      await testService.createAddress(contact.id)
    })

    it('should rejected if contact not found', async () => {
      const contacts = await testService.getContacts()
      const res = await request(app.getHttpServer())
        .get(`/api/contacts/${contacts[0].id+1}/addresses`)
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toEqual(HttpStatus.NOT_FOUND);
      expect(res.body.error).toBeDefined();
    });

    it('should be able list address', async () => {
      const contacts = await testService.getContacts()
      const res = await request(app.getHttpServer())
        .get(`/api/contacts/${contacts[0].id}/addresses`)
        .set('Authorization', 'test')

      logger.info(res.body)
      
      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].id).toBeDefined();
      expect(res.body.data[0].street).toBe('street test');
      expect(res.body.data[0].city).toBe('city test');
      expect(res.body.data[0].province).toBe('province test');
      expect(res.body.data[0].postal_code).toBe('1234');
      expect(res.body.data[0].country).toBe('country test');
    });

  })
});
