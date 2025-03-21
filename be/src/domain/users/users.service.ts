import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/domain/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserT } from 'src/common/types/user.type';

@Injectable({})
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(
    private readonly db: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async findOneByEmail(email: string){
    const response = await this.db.user.findFirst({
      where: {
        email,
      }
    }) 
    
    if(!response){
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    
    return response;
  };

  async findOne(userId: number) {
    return await this.db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }
  
  async updateVerifiedAt(userId: number, verifyNow: boolean){
    try{
      const response = await this.db.user.update({
        where: {
          id: userId
        },
        data: {
          emailVerifiedAt: verifyNow ? new Date() : null,
        }
      });
      
      if(!response){
        throw new Error("Email verification failed.");
      }
      
    }catch(e){
      this.logger.error(e);
      
      throw new HttpException("Cannot update the user verification status", HttpStatus.CONFLICT);
    }
  }

  async create(userDot: CreateUserDto) {
    try {
      const response = await this.db.user.create({
        data: {
          email: userDot.email,
          passwordHash: await this.authService.createPasswordHash(
            userDot.password,
          ),
          name: userDot.name,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
      
      // notify to send email
      
      return response;
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(
        'Please use a different email',
        HttpStatus.CONFLICT,
      );
    }
  }

  async update(userDto: UpdateUserDto, userId: number) {
    return await this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        name: userDto.name,
        passwordHash: await this.authService.createPasswordHash(
          userDto.password,
        ),
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  async delete(userId: number) {
    const response = await this.db.user.delete({
      where: {
        id: userId,
      },
    });

    if (!response) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: 'User deleted',
    };
  }
}
