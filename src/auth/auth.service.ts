import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/dto/register-user.dto';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async create(registerUserDto: RegisterUserDto) {
    const { username, password } = registerUserDto;
    const saltOrRounds = 11;
    const hashed = await bcrypt.hash(password, saltOrRounds);
    const salt = await bcrypt.genSalt();
    const foundUser = await this.userRepository.findOne({
      where: { username },
    });

    if (!foundUser) {
      const user = new UserEntity();
      user.username = username;
      user.password = hashed;
      user.salt = salt;

      this.userRepository.create(user);
      try {
        return await this.userRepository.save(user);
      } catch (error) {
        throw new InternalServerErrorException(
          'something went wrong, user was not created.',
        );
      }
    } else {
      throw new BadRequestException('Username already exists.');
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException('invalid credentials.');
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (passwordMatched) {
      const jwtPayload = { username };
      const jwtToken = await this.jwtService.signAsync(jwtPayload, {
        expiresIn: 3600,
        algorithm: 'HS512',
      });
      return { token: jwtToken };
    } else {
      throw new UnauthorizedException('invalid credentials.');
    }
  }
}
