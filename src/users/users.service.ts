import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  private async ifEmailAlreadyTakenThrowsException(
    email: string,
  ): Promise<void> {
    const emailAlreadyTaken = await this.userModel.findOne({ email });

    if (emailAlreadyTaken)
      throw new HttpException(
        `Email: ${email} already taken`,
        HttpStatus.CONFLICT,
      );
  }

  async create({ name, email, password }: CreateUserDto): Promise<void> {
    await this.ifEmailAlreadyTakenThrowsException(email);

    await this.userModel.create({ name, email, password });
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find();

    return users;
  }

  async findOne(id: string) {
    const user = await this.userModel.findOne({
      _id: id,
    });

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
