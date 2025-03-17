import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseDto401 {
  @ApiProperty({type: 'number', example: 401})
  statusCode: number

  @ApiProperty({type: 'string', example: 'Invalid Credentials'})
  message: string;
}

export class LoginResponse201 {
  @ApiProperty({type: 'boolean', example: true})
  success: boolean 
  
  @ApiProperty({type: 'string', example: '36614bd-725d-4e60-ac2e-4aaed7e7e17c'})
  token: string
}

export class LoginResponse400 {
  @ApiProperty({type: 'number', example: 400})
  statusCode: number

  @ApiProperty({type: 'string', example: 'Please verify your account first'})
  message: string;
} 

export class SendSstResponseDto200 {
  @ApiProperty({type: 'boolean', example: true})
  succes: boolean 
  
  @ApiProperty({type: 'string', example: 'Link has been sent'})
  message: string
}

export class SignupResponse201 {
  @ApiProperty({type: 'number', example: 102})
  id: number;
  
  @ApiProperty({type: 'string', example: 'user@lftechnology.com'})
  email: string;
  
  @ApiProperty({type: 'string', example: 'user'})
  name: string;
}

export class SignupResponse409 {
  @ApiProperty({type: 'number', example: 409})
  statusCode: number;
  
  @ApiProperty({type: 'string', example: 'Please use a different email'})
  message: string;
}

export class SignupResponse400 {
  @ApiProperty({type: 'number', example: 400})
  statusCode: number
  
  @ApiProperty({type: 'string', example: 'Bad Request'})
  error: string
  
  @ApiProperty({type: 'array', items: {
    type: 'string'
  }})
  message: string[]
}

export class LogoutResponse200 {
  @ApiProperty({type: 'string', example: 'Logged out succesfully'})
  message: string
}
