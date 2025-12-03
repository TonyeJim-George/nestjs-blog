import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { User } from 'src/users/user.entity';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    // Injecting JwtService
    private readonly jwtService: JwtService,
    
    //Inject JWT Config
    @Inject(jwtConfig.KEY)
    private readonly jwtconfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async signToken<T>(userId: number, expiresIn: number, payload?: T){
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtconfiguration.audience,
        issuer: this.jwtconfiguration.issuer,
        secret: this.jwtconfiguration.secret,
        expiresIn,
      },
    );
  }

  public async generateToken<T>(user: User){

    const [accessToken, refreshToken] = await Promise.all([
      //Generate Access Token
      this.signToken<Partial<ActiveUserData>>(user.id, this.jwtconfiguration.accessTokenTtl, {
        email: user.email,
      }),

      //Generate Refresh Token
      this.signToken(user.id, this.jwtconfiguration.refreshTokenTtl),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
