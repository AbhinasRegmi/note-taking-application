import { ApiProperty } from "@nestjs/swagger"

export class ResponseDto400 {
  @ApiProperty({type: 'number', example: 400})
  statusCode: number
  
  @ApiProperty({type: 'string', example: 'Bad Request'})
  error: string
  
  @ApiProperty({type: 'array', items: {
    type: 'string'
  }})
  message: string[]
}

export class ResponseDto401 {
  @ApiProperty({type: 'number', example: 401})
  statusCode: number
  
  @ApiProperty({type: 'string', example: 'Unauthorized'})
  message: string
}

export class ResponseDto404 {
  @ApiProperty({type: 'number', example: 404})
  statusCode: number
  
  @ApiProperty({type: 'string', example: 'Not found'})
  message: string;
}