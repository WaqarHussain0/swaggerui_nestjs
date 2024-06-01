import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. The input data is invalid.',
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Search users by name or email. Partial matches are supported.',
  })
  @Get()
  async findAll(@Query('search') search?: string) {
    return await this.userService.findAll(search);
  }

  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Details of a user.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. The provided ID is not a valid MongoDB ObjectId.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. The user does not exist.',
  })
  @ApiParam({
    name: 'userID',
    description: 'The ID of the user to retrieve',
    type: String,
  })
  @Get(':userID')
  async findOne(@Param('userID') userID: string) {
    if (!Types.ObjectId.isValid(userID)) {
      throw new BadRequestException('Invalid MongoDB ObjectId.');
    }
    return await this.userService.findOne(userID);
  }

  @ApiOperation({ summary: 'Update user details by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user details have been successfully updated.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. The input data is invalid or the ID is not a valid MongoDB ObjectId.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. The user does not exist.',
  })
  @ApiParam({
    name: 'userID',
    description: 'The ID of the user to update',
    type: String,
  })
  @Put(':userID')
  async updateOne(
    @Param('userID') userID: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (!Types.ObjectId.isValid(userID)) {
      throw new BadRequestException('Invalid MongoDB ObjectId.');
    }
    return await this.userService.update(userID, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. The ID is not a valid MongoDB ObjectId.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. The user does not exist.',
  })
  @ApiParam({
    name: 'userID',
    description: 'The ID of the user to delete',
    type: String,
  })
  @Delete(':userID')
  async remove(@Param('userID') userID: string) {
    if (!Types.ObjectId.isValid(userID)) {
      throw new BadRequestException('Invalid MongoDB ObjectId.');
    }
    return await this.userService.remove(userID);
  }
}
