import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignupDto } from './dto/signup.dto';


@Injectable()
export class AuthService {

    constructor(private usersService: UsersService) { }

    async login(authCredentialsDto: AuthCredentialsDto) {
        const { username, password } = authCredentialsDto;
        const user = this.usersService.findOne(username);

        if (user && user.password === password) {
            const { password: _, ...result } = user;
            return result;
        }

        return null;
    }

    async signup(signupDto: SignupDto) {
        const { name, password , email } = signupDto;
        const existingUser = this.usersService.findOne(email);

        if (existingUser) {

            return null;
        }

        return this.usersService.create({name, password, email});
    }

}
