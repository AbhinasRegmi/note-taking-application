import { ApiProperty } from "@nestjs/swagger";

export class FindAllCategoryResponse200 {
  @ApiProperty({type: 'number', example: 1})
  id: number;
  
  @ApiProperty({type: 'string', example: 'win'})
  name: string;
  
  @ApiProperty({type: 'number', example: 3})
  count: number;
} 

export class CreateCategoryResponse201 {
  @ApiProperty({type: 'number', example: 1})
  id: number;
  
  @ApiProperty({type: 'string', example: 'win'})
  name: string;

  @ApiProperty({ type: 'string', example: '2025-01-01' })
  updatedAt: string;

  @ApiProperty({ type: 'string', example: '2025-01-01' })
  createdAt: string;

  @ApiProperty({type: 'number', example: 1})
  userId: number;
}

export class CreateCategoryResponse409 {
  @ApiProperty({type: 'number', example: 409})
  statusCode: number;
  
  @ApiProperty({type: 'string', example: 'Try another name for category'})
  message: string;
}
