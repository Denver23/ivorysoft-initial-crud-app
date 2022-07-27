import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from './user.service';
import { UserDocument } from './user.model';
import { AuthService } from '../auth/auth.service';
import {
  ResponseBuilderService,
  SwaggerResponseBuilder,
} from '../responseBuilder/responseBuilder.service';
import { Request, Response } from 'express';
import { TokensObject, UserObjectPublic } from '../config/swagger-examples';
import { ProjectError } from '../filters/all-exceptions.filter';
import { Roles } from '../roles-guard/roles.decorator';
import { Role } from '../roles-guard/role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles-guard/roles.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  private logger: Logger;

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly responseBuilderService: ResponseBuilderService,
  ) {
    this.logger = new Logger('UserController');
  }

  @ApiOperation({
    summary: 'This should register new user',
    description:
      'This is for registration the new user requires name, email, and password',
  })
  @ApiCreatedResponse({
    description: 'Created',
    content: {
      'application/json': {
        example: SwaggerResponseBuilder.sendSuccess({
          user: UserObjectPublic,
          ...TokensObject,
        }),
      },
    },
  })
  @Post('')
  async registerUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body() newUser: RegisterUserDto,
  ): Promise<Response> {
    this.logger.log(
      `${req.method} ${req.url} register new user body: ${JSON.stringify(
        newUser,
      )}`,
    );

    const user: UserDocument = await this.userService.create(newUser);

    const [token, refreshToken] = [
      this.authService.getAuthToken(user._id),
      this.authService.getRefreshToken(user._id),
    ];

    return res.status(HttpStatus.CREATED).json(
      this.responseBuilderService.sendSuccess({
        user: user.publicFields(),
        token,
        refreshToken,
      }),
    );
  }

  @ApiOperation({
    summary: 'This should return user by id',
    description: 'Returning user by id',
  })
  @ApiOkResponse({
    description: 'Success',
    content: {
      'application/json': {
        example: SwaggerResponseBuilder.sendSuccess(UserObjectPublic),
      },
    },
  })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':userId')
  async getUser(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userId') userId: string,
  ) {
    const user = await this.userService.findById(userId);
    if (!user) throw new ProjectError(1008);

    return res
      .status(HttpStatus.OK)
      .json(this.responseBuilderService.sendSuccess(user.publicFields()));
  }
}
