import { Controller, Post, Body, HttpCode, UseGuards, Get, Request, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { JwtAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

//   @Post('login')
//   @HttpCode(200)
//   async login(@Body() loginDto: LoginDto) {
//     const user = await this.authService.validateUser(loginDto.username, loginDto.password);
//     if (!user) {
//       throw new Error('Invalid credentials');
//     }
//     return this.authService.login(user);
//   }

@Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    console.log('in loginDto', loginDto);

    try {
      const user = await this.authService.validateUser(loginDto.username, loginDto.password);
      return this.authService.login(user);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Invalid credentials',
      }, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('register') // Combined with @Controller, this creates '/auth/register'
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard) // Requires valid JWT
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }
}

