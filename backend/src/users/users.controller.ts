import { Controller, Patch, Body, Session, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Patch('profile')
    updateProfile(@Body() updateUserDto: UpdateUserDto, @Session() session) {
        // this just for demo, we shoudl use a middleware  from a higher level
        if (!session.user) {
            throw new UnauthorizedException('Not logged in');
        }

        const updatedUser = this.usersService.update(session.user.id, updateUserDto);
        if (updatedUser) {
            const { password, ...result } = updatedUser;
            session.user = result;
            return result;
        }
        return { message: 'User not found' };
    }
}
