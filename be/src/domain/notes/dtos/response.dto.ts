import { ApiProperty } from '@nestjs/swagger';

export class FindAllResponse200 {
  @ApiProperty({ type: 'number', example: 1 })
  id: number;

  @ApiProperty({ type: 'number', example: 1 })
  userId: number;

  @ApiProperty({ type: 'string', example: 'How to win a war' })
  title: string;

  @ApiProperty({ type: 'string', example: 'Plan ahead. Have lots of troops' })
  content: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      example: 'war',
    },
  })
  categories: string[];

  @ApiProperty({ type: 'string', example: 'how-to-win-a-war' })
  slug: string;

  @ApiProperty({ type: 'string', example: '2025-01-01' })
  updatedAt: string;

  @ApiProperty({ type: 'string', example: '2025-01-01' })
  createdAt: string;
}

export class UpdateResponse409 {
  @ApiProperty({ type: 'number', example: 409 })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    example: 'Cannot update note. Try again with different title.',
  })
  message: string;
}

export class DeleteResponse409 {
  @ApiProperty({ type: 'number', example: 409 })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    example: 'Cannot delete note. Try again later.',
  })
  message: string;  
}


export class DeleteResponse200 {
  @ApiProperty({ type: 'number', example: 1 })
  id: number;

  @ApiProperty({ type: 'number', example: 1 })
  userId: number;

  @ApiProperty({ type: 'string', example: 'How to win a war' })
  title: string;

  @ApiProperty({ type: 'string', example: 'Plan ahead. Have lots of troops' })
  content: string;

  @ApiProperty({ type: 'string', example: 'how-to-win-a-war' })
  slug: string;

  @ApiProperty({ type: 'string', example: '2025-01-01' })
  updatedAt: string;

  @ApiProperty({ type: 'string', example: '2025-01-01' })
  createdAt: string;
}