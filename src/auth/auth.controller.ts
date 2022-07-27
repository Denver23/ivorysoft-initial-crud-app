import { Body, Headers, Controller, Get, HttpStatus, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ResponseBuilderService, SwaggerResponseBuilder } from '../responseBuilder/responseBuilder.service';
import { Response } from 'express';
import { errorsList } from '../config/errorsList';
import { UserService } from '../user/user.service';
import { RefreshTokenBodyDto, RefreshTokenHeadersDto } from '../user/dto/refresh-token.dto';
import { configuration } from '../config/configuration';
import { ProjectError } from '../filters/all-exceptions.filter';
import { UserDocument } from '../user/user.model';
import { TokensObject, UserObjectPublic } from '../config/swagger-examples';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseBuilderService: ResponseBuilderService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Email and password login user' })
  @ApiOkResponse({
    description: 'New tokens successfully created.',
    content: {
      'application/json': {
        example: SwaggerResponseBuilder.sendSuccess({
          user: UserObjectPublic,
          ...TokensObject,
        }),
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Request() req, @Res() res, @Body() loginDto: LoginDto): Promise<any> {
    const { user } = req;

    const token = this.authService.getAuthToken(user.id);
    const refreshToken = this.authService.getRefreshToken(user.id);

    return res.status(HttpStatus.OK).json(
      this.responseBuilderService.sendSuccess({
        user,
        token,
        refreshToken,
      }),
    );
  }

  @ApiOperation({
    summary: 'This should refresh jwt token',
    description:
      'This is for refresh jwt token. Accept expired token in the req.headers.authorization and the refreshToken in req.body',
  })
  @ApiOkResponse({
    description: 'OK',
    content: {
      'application/json': {
        example: SwaggerResponseBuilder.sendSuccess(TokensObject),
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    content: {
      'application/json': {
        example: SwaggerResponseBuilder.sendError(errorsList.error1003.message, errorsList.error1003.code),
      },
    },
  })
  @ApiBearerAuth()
  @Post('/refresh')
  async refreshToken(
    @Req() req: Request,
    @Res() res: Response,
    @Headers() { authorization }: RefreshTokenHeadersDto,
    @Body() { refreshToken }: RefreshTokenBodyDto,
  ) {
    const oldAuthToken = authorization.split(' ')[1];
    const decoded: any = this.authService.decodeJWT(oldAuthToken, configuration.jwt.jwtSecret, true);
    const decodedRefresh: any = this.authService.decodeJWT(refreshToken, configuration.jwt.jwtRefreshSecret);
    if (!decoded._id || !decodedRefresh._id || decoded._id !== decodedRefresh._id) throw new ProjectError(1012);
    const user: UserDocument = await this.userService.findById(decoded._id);
    if (!user) throw new ProjectError(1012);
    const [token, newRefreshToken] = [
      this.authService.getAuthToken(user._id),
      this.authService.getRefreshToken(user._id),
    ];
    return res.status(HttpStatus.OK).json(
      this.responseBuilderService.sendSuccess({
        refreshToken: newRefreshToken,
        token,
      }),
    );
  }

  @ApiOperation({ summary: 'Fetch my profile' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Fetch user by token',
    content: {
      'application/json': {
        example: SwaggerResponseBuilder.sendSuccess(UserObjectPublic),
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req, @Res() res) {
    const { user } = req;
    return res.status(HttpStatus.OK).json(this.responseBuilderService.sendSuccess(user.publicFields()));
  }
}
