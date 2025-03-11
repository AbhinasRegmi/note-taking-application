import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/domain/prisma/prisma.service';

@Injectable({})
export class UsersService {
  constructor(private readonly db: PrismaService) {}
  modules}
