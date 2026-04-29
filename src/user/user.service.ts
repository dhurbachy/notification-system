import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 🔥 Create user (register)
  async create(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;

    // check if user exists
    const existing = await this.userRepository.findOne({
      where: { email },
    });

    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  // 🔥 Get all users
  async findAll() {
    return this.userRepository.find({
      select: ['id', 'name', 'email', 'created_at'], // hide password
    });
  }

  // 🔥 Get one user
  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'created_at'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // 🔥 Update user
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // if updating password → hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        10,
      );
    }

    Object.assign(user, updateUserDto);

    return this.userRepository.save(user);
  }

  // 🔥 Delete user
  async remove(id: string) {
    const result = await this.userRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User deleted successfully' };
  }

  // 🔥 IMPORTANT: used by AuthService
  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }
}
