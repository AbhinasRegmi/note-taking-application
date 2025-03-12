import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;
  
  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}
