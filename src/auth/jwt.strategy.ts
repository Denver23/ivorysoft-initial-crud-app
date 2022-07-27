import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { configuration } from '../config/configuration';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';
import { ProjectError } from '../filters/all-exceptions.filter';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration.jwt.jwtSecret,
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.userService.findById(payload._id);
    if (!user) {
      throw new ProjectError(1003);
    }
    return user;
  }
}
