import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';

describe('Test the signed url generation and validation', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => 'thisisourmocksecretkey'),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
  });

  it('should return a hash', () => {

    expect(authService.generateSignedToken('abhinas', 10)).toBeDefined();

  });

  it('should validate the hash', () => {
    const { data, expiryUtc, signedHash } =
      authService.generateSignedToken('abhinas', 10);

    expect(
      authService.vaildateSignedToken(data, expiryUtc, signedHash),
    ).toBe(true);

  });

  it('should not pass random hash', async () => {
    const { expiryUtc, signedHash } = await authService.generateSignedToken(
      'abhians',
      10,
    );

    expect(
      await authService.vaildateSignedToken('random', expiryUtc, signedHash),
    ).toBe(false);

  });

});
