import { Req, Controller, Get, Post, Body, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  async login(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Session() session,
  ) {
    const user = await this.auth.login(authCredentialsDto);
    if (user) {
      session.user = user;
      return { message: 'Login successful', user };
    }
    return { message: 'Invalid credentials' };
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto, @Session() session) {
    const user = await this.auth.signup(signupDto);
    if (user) {
      session.user = user;
      return { message: 'Signup successful', user };
    }
    return { message: 'Signup failed! User may already exist' };
  }

  @Post('logout')
  logout(@Session() session) {
    session.user = null;
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  me(@Session() session) {
    return session.user || null;
  }
}
