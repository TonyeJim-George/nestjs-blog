import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class findOneByGoogleIdProvider {
  constructor(

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async findOneByGoogleId(googleId: string){
    return await this.usersRepository.findOneBy({ googleId });
  }
}
