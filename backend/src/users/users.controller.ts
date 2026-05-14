import {
  Controller,
  Patch,
  Body,
  Get,
  Param,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

// For admin to view all users
  @Get()
  findAll(@CurrentUser() user) {
    if (user.role !== 'admin') {
      return { message: 'Unauthorized' };
    }
    return this.usersService.findAll().map(({ password, ...user }) => user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const user = this.usersService.findById(id);
    if (!user) {
      return { message: 'User not found' };
    }
    const { password, ...result } = user;
    return result;
  }

  @Patch('profile')
  @UseGuards(AuthGuard)
  updateProfile(@Body() updateUserDto: UpdateUserDto, @Session() session) {
    const updatedUser = this.usersService.update(
      session.user.id,
      updateUserDto,
    );
    if (updatedUser) {
      const { password, ...result } = updatedUser;
      session.user = result;
      return result;
    }
    return { message: 'User not found' };
  }
}
