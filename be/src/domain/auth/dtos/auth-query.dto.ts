import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsString } from 'class-validator';

export class AuthQueryDto {
  @IsString()
  @ApiProperty()
  data: string;

  @IsString()
  @ApiProperty()
  expiry: string;

  @IsString()
  @ApiProperty()
  token: string;
}

export class AuthVerificationQueryDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;
}
