import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtCustomStrategy } from './jwt-custom.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: 'TheSecretOfMyAppBro12345',
      signOptions: {
        algorithm: 'HS512',
        expiresIn: 3600,
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtCustomStrategy],
  exports: [PassportModule, JwtCustomStrategy],
})
export class AuthModule {}
