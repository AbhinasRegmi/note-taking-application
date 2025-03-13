import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  take?: number = 10;

  @IsInt()
  @Min(0)
  @ApiPropertyOptional()
  page?: number = 0;
}
