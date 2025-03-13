import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

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
