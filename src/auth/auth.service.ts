import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerDto: RegisterDto) {
    const existingUser: User | null = await this.userService.findByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(registerDto.password, salt);
    registerDto.password = hash;
    const user = await this.userService.create(registerDto);
    return {
      email: user.email,
      name: user.name,
      _id: user.id,
    };
  }
  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payLoad = { sub: user._id, email: user.email };
    return {
      message: 'User login successfully',
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        access_token: await this.jwtService.signAsync(payLoad),
      },
    };
  }
}
