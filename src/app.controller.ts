import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseBuilderService } from './responseBuilder/responseBuilder.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly responseBuilderService: ResponseBuilderService,
  ) {}

  @Get()
  async baseURL(@Req() req: Request, @Res() res: Response) {
    return res
      .status(HttpStatus.OK)
      .json(
        this.responseBuilderService.sendSuccess(this.appService.getHello()),
      );
  }
}
