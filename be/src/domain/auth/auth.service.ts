import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  Redirect,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import {
  CannotLogInError,
  CannotLogOutError,
  InvalidCredentialsError,
} from '../../common/exceptions/auth.exceptions';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { UserT } from 'src/common/types/user.type';
import { randomUUID, createHash } from 'node:crypto';
import { AuthQueryDto, AuthVerificationQueryDto } from './dtos/auth-query.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly db: PrismaService,
    private readonly config: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
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
        emailVerifiedAt: true,
        passwordHash: true,
      },
    });

    if (!userFromDb) {
      throw InvalidCredentialsError;
    }

    if (!userFromDb.emailVerifiedAt) {
      throw new HttpException(
        'Please verify your account first.',
        HttpStatus.BAD_REQUEST,
      );
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

  generateSignedToken(data: string, expiryInMinutes: number) {
    const expiryUtc = Date.now() + expiryInMinutes * 1000 * 60;
    const stringToHash = `${data}-${expiryUtc}-${this.config.get('auth.secretKey')}`;
    const signedHash = createHash('md5')
      .update(stringToHash)
      .digest('base64url');

    return {
      data,
      expiryUtc: expiryUtc.toString(),
      signedHash,
    };
  }

  vaildateSignedToken(data: string, expiryUtc: string, signedHash: string) {
    const stringToHash = `${data}-${expiryUtc}-${this.config.get('auth.secretKey')}`;
    const newHash = createHash('md5').update(stringToHash).digest('base64url');
    const expiryDate = new Date(Number(expiryUtc));

    if (newHash == signedHash && expiryDate.getTime() > Date.now()) {
      return true;
    }

    return false;
  }

  async generateVerificationLink(
    email: string,
    baseConfigUrl: string = 'auth.verificationLinkBaseUrl',
  ) {
    // Warning: this shouldn't be called from any controller. Only from notification or other services
    try {
      const user = await this.userService.findOneByEmail(email);
      const response = this.generateSignedToken(
        user.id.toString(),
        this.config.get('auth.verificationExpiryMinutes'),
      );
      const verificationUrl = `${this.config.get(baseConfigUrl)}?token=${response.signedHash}&expiry=${response.expiryUtc}&data=${response.data}`;

      await this.db.singleSignInToken.create({
        data: {
          token: response.signedHash,
        },
      });

      return verificationUrl;
    } catch (e) {
      this.logger.error(e);

      throw new HttpException(
        'Cannot generate verification link',
        HttpStatus.CONFLICT,
      );
    }
  }

  async verifyAccount(query: AuthQueryDto) {
    if (!this.vaildateSignedToken(query.data, query.expiry, query.token)) {
      throw new HttpException('Url is no longer valid', HttpStatus.BAD_REQUEST);
    }

    const response = await this.db.singleSignInToken.delete({
      where: {
        token: query.token,
      },
    });

    if (!response) {
      return {
        success: false,
        message: 'Link already expired. Please generate a new link.',
      };
    }

    await this.userService.updateVerifiedAt(+query.data, true);

    return {
      success: true,
      message: 'Please login to gain access',
    };
  }

  async loginSst(query: AuthQueryDto) {
    const response = await this.verifyAccount(query);

    if (!response) {
      throw new HttpException('', 500);
    }

    if (response.success) {
      const session = await this.createSessionTokenFor(+query.data);

      return {
        success: true,
        value: session.token,
      };
    }

    return {
      success: false,
      message: response.message,
    };
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
