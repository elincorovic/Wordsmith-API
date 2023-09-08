import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

//strategy for extracting jwt from headers
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  //'jwt' is the key for auth guards
  constructor(
    config: ConfigService, //not private because its used in super (must be called before anything)
    private prisma: PrismaService,
  ) {
    super({
      //jwt should be extracted from headers
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; username: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    return user; //appending user obj to req obj
  }
}
