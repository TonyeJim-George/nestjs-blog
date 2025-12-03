import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { findOneByGoogleIdProvider } from './find-one-by-google-id';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { CreateUserProvider } from './create-user.provider';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {

    const mockCreateUserProvider: Partial<CreateUserProvider> = {
      createUser: (createUserDto: CreateUserDto) => Promise.resolve({
        id: 1,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        password: createUserDto.password,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, 
        {provide: CreateUserProvider, useValue: mockCreateUserProvider },
        {provide: DataSource, useValue: {} },
        {provide: getRepositoryToken(User), useValue: {} },
        {provide: UsersCreateManyProvider, useValue: {} },
        {provide: FindOneUserByEmailProvider, useValue: {} },
        {provide: findOneByGoogleIdProvider, useValue: {} },
        {provide: CreateGoogleUserProvider, useValue: {} },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });


    it('Service should be defined', () => {
      expect(service).toBeDefined();
    });

    describe('createUser', () => {
      it('should be defined', () => {
        expect(service.createUser).toBeDefined();
      });
      it('should create a user', async () => {
        let user = await service.createUser({
          firstName: 'John',
          lastName: 'Doe',
          email: 'test.user@example.com',
          password: 'Password123#',
        });
        expect(user.firstName).toEqual('John');
      });
    });

});