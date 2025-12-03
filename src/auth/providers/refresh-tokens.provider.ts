import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/providers/users.service';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class RefreshTokensProvider {

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly generateTokensProvider: GenerateTokensProvider,
    
    @Inject(jwtConfig.KEY)
    private readonly jwtconfiguration: ConfigType<typeof jwtConfig>,
  ){}

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try{
    //verify the refresh token using jwtService
    const { sub } = await this.jwtService.verifyAsync
      <Pick <ActiveUserData, 'sub'>>(refreshTokenDto.refreshToken, {
      audience: this.jwtconfiguration.audience,
      issuer: this.jwtconfiguration.issuer,
      secret: this.jwtconfiguration.secret,
    });
    //Fetch the user from the database
    const user = await this.usersService.findOneById(sub);
    //Generate the tokens.
    return await this.generateTokensProvider.generateToken(user); 
  }
    catch(error){
      throw new UnauthorizedException(error)
    }
  }
}







