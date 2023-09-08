import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService, //jwt service from package
    private config: ConfigService,
  ) {}
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');

    const passwordMatches = await argon.verify(user.hash, dto.password);
    if (!passwordMatches) throw new ForbiddenException('Password incorrect');

    return this.signToken(user.id, user.username, user.email);
  }

  async signup(dto: SignupDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          hash,
        },
      });

      return this.signToken(user.id, user.username, user.email);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.log(error);
          if (error.meta.target[0] === 'username')
            throw new ForbiddenException('username taken');
          if (error.meta.target[0] === 'email')
            throw new ForbiddenException('email already in use');
        }
      }
      throw error;
    }
  }

  async signToken(
    userId: number,
    username: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      username,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return {
      access_token: token,
    };
  }
}
