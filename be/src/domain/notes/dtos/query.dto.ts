import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class NoteQueryDto extends PaginationDto {
  @IsIn(['title', 'createdAt', 'updatedAt'])
  @ApiPropertyOptional({
    enum: ['title', 'createdAt', 'updatedAt'],
  })
  orderBy: string = 'updatedAt';

  @IsIn(['asc', 'desc'])
  @ApiPropertyOptional({
    enum: ['asc', 'desc']
  })
  sortOrder: string = 'asc';

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  search: string = '';
}
