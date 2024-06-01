import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.create(createUserDto);
    const dataToSend = {
      message: 'User added successfully!',
      statusCode: HttpStatus.CREATED,
      user,
    };
    return dataToSend;
  }

  async findAll(search?: string) {
    const totalRecords = await this.userModel.countDocuments({}).exec();
    if (search) {
      const users = await this.userModel.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      });
      const dataToSend = {
        message: 'Details of player by search',
        statusCode: HttpStatus.OK,
        totalRecords,
        filteredRecord: users.length,
        users,
      };
      return dataToSend;
    }
    const users = await this.userModel.find();
    const dataToSend = {
      message: 'List of all Users',
      statusCode: HttpStatus.OK,
      totalRecords,
      users,
    };
    return dataToSend;
  }

  async findOne(userID: string) {
    const objectID = new Types.ObjectId(userID);
    const user = await this.userModel.findById(objectID);
    if (!user) {
      throw new NotFoundException('User not found again given userID');
    }
    const dataToSend = {
      message: 'Details of a user',
      statusCode: HttpStatus.OK,
      user,
    };
    return dataToSend;
  }

  async update(userID: string, updateUserDto: UpdateUserDto) {
    const objectID = new Types.ObjectId(userID);
    const user = await this.userModel.findById(objectID);
    if (!user) {
      throw new NotFoundException('User not found again given userID');
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(
      objectID,
      updateUserDto,
      { new: true },
    );
    const dataToSend = {
      message: 'User updated successfully!',
      statusCode: HttpStatus.OK,
      updatedUser,
    };
    return dataToSend;
  }

  async remove(userID: string) {
    const objectID = new Types.ObjectId(userID);
    const user = await this.userModel.findById(objectID);
    if (!user) {
      throw new NotFoundException('User not found again given userID');
    }
    const deletedUser = await this.userModel.findByIdAndDelete(objectID);
    const dataToSend = {
      message: 'User deleted successfully!',
      statusCode: HttpStatus.OK,
      deletedUser,
    };
    return dataToSend;
  }
}
