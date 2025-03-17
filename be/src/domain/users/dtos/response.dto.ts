import { ApiProperty } from "@nestjs/swagger";

export class GetProfileResponse200 {
  @ApiProperty({type: 'number', example: 1})
  id: number
  
  @ApiProperty({type: 'string', example: 'user@lftechnology.com'})
  email: string
  
  @ApiProperty({type: 'string', example: 'froggy'})
  name: string
}

export class DeleteUserResponse200 {
  @ApiProperty({type: 'boolean', example: true})
  success: boolean
  
  @ApiProperty({type: 'string', example: 'User deleted'})
  message: string
}