import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserProvider } from './create-user.provider';
import { MailService } from 'src/mail/providers/mail.service';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('CreateUserProvider', () => {

  let provider: CreateUserProvider;
  let usersRepository: MockRepository<User>;
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123#',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateUserProvider,
        { provide: MailService, 
          useValue: {sendUserWelcome: jest.fn(()=> Promise.resolve())} 
        },
        { provide: HashingProvider, 
          useValue: {hashPassword: jest.fn(() => user.password)} 
        },
        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
      ],
    }).compile();

    provider = module.get<CreateUserProvider>(CreateUserProvider);
    usersRepository = module.get(getRepositoryToken(User));
  });


    it('Service should be defined', () => {
      expect(provider).toBeDefined();
    });

    describe('createUser', () => {
      describe('when user does not exist in the database', () => {
        it('should create a new user', async () => {
          usersRepository.findOne.mockReturnValue(null);
          usersRepository.create.mockReturnValue(user);
          usersRepository.save.mockReturnValue(user);
          
          const newUser = await provider.createUser(user);

          expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { email: user.email } });
          expect(usersRepository.create).toHaveBeenCalledWith(user);
          expect(usersRepository.save).toHaveBeenCalledWith(user);
          
        });
      });
      describe('when user exists', () => {
        it('throw BadRequestException', async () => {
          usersRepository.findOne.mockReturnValue(user.email);
          usersRepository.create.mockReturnValue(user);
          usersRepository.save.mockReturnValue(user);

          try{
            const newUser = await provider.createUser(user);
          } catch(error){
            expect(error).toBeInstanceOf(BadRequestException)
          }
        });
      });
    })


});