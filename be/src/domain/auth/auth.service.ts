import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import {
  CannotLogInError,
  CannotLogOutError,
  InvalidCredentialsError,
} from 'src/common/exceptions/auth.exceptions';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { UserT } from 'src/common/types/user.type';
import { randomUUID } from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async createSessionTokenFor(userId: number) {
    const token = randomUUID();
    const session = await this.db.session.create({
      data: {
        value: token,
        userId,
      },
    });

    if (!session) {
      throw CannotLogInError;
    }

    return {
      success: true,
      token,
    };
  }

  async createOTP() {}

  async verifyOTP() {}

  async twofa() {}

  async createPasswordHash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.config.get('auth.saltRounds'));
  }

  async comparePasswordHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async login(userDto: LoginDto) {
    const userFromDb = await this.db.user.findUnique({
      where: {
        email: userDto.email,
      },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!userFromDb) {
      throw InvalidCredentialsError;
    }

    const isPasswordCorrect = await this.comparePasswordHash(
      userDto.password,
      userFromDb.passwordHash,
    );

    if (!isPasswordCorrect) {
      throw InvalidCredentialsError;
    }

    return await this.createSessionTokenFor(+userFromDb.id);
  }

  async logout(loggedUser: UserT) {
    const reponse = await this.db.session.deleteMany({
      where: {
        value: loggedUser.sessionToken,
      },
    });

    if (!reponse) {
      throw CannotLogOutError;
    }

    return {
      message: 'Logged out successfully',
    };
  }
}
