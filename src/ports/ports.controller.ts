import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PortsService } from './ports.service';
import {
  ResponseBuilderService,
  SwaggerResponseBuilder,
} from '../responseBuilder/responseBuilder.service';
import { Request, Response } from 'express';
import { PortObject } from '../config/swagger-examples';
import { CreatePortDto } from './dto/create-port.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectError } from '../filters/all-exceptions.filter';
import { Role } from '../roles-guard/role.enum';
import { PortDocument } from './ports.model';
import { UpdatePortDto } from './dto/update-port.dto';
import { RolesGuard } from '../roles-guard/roles.guard';
import { Roles } from '../roles-guard/roles.decorator';

@ApiTags('Ports')
@Controller('ports')
export class PortsController {
  constructor(
    private readonly portsService: PortsService,
    private readonly responseBuilderService: ResponseBuilderService,
  ) {}

  @ApiOperation({
    summary: 'Should create new Port (admin)',
    description: 'Returns new Port Object',
  })
  @ApiCreatedResponse({
    description: 'Created',
    content: {
      'application/json': {
        example: SwaggerResponseBuilder.sendSuccess(PortObject),
      },
    },
  })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createPortDto: CreatePortDto,
  ) {
    const port = await this.portsService.create(createPortDto);

    return res
      .status(HttpStatus.CREATED)
      .json(this.responseBuilderService.sendSuccess(port));
  }

  @ApiOperation({
    summary: 'Should delete Port by id (admin)',
    description: 'Delete Port',
  })
  @ApiCreatedResponse({
    description: 'No Content',
  })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':portId')
  public async delete(
    @Req() req: Request,
    @Res() res: Response,
    @Param('portId') portId: string,
  ): Promise<Response> {
    const port: PortDocument | null = await this.portsService.findById(portId);
    if (!port) throw new ProjectError(1014);

    await this.portsService.delete(portId);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @ApiOperation({
    summary: 'Should fetch Port by id',
    description: 'Get Port',
  })
  @ApiCreatedResponse({
    description: 'Ok',
    content: {
      'application/json': {
        example: SwaggerResponseBuilder.sendSuccess(PortObject),
      },
    },
  })
  @Get(':portId')
  public async getPort(
    @Req() req: Request,
    @Res() res: Response,
    @Param('portId') portId: string,
  ): Promise<Response> {
    const port: PortDocument | null = await this.portsService.findById(portId);

    if (!port) throw new ProjectError(1014);

    return res
      .status(HttpStatus.OK)
      .json(this.responseBuilderService.sendSuccess(port));
  }

  @ApiOperation({
    summary: 'Should fetch all Ports',
    description: 'Get Ports',
  })
  @ApiCreatedResponse({
    description: 'Ok',
    content: {
      'application/json': {
        example: SwaggerResponseBuilder.sendSuccess([PortObject]),
      },
    },
  })
  @Get('')
  public async getAllPorts(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const ports: PortDocument[] = await this.portsService.findAll();

    return res
      .status(HttpStatus.OK)
      .json(this.responseBuilderService.sendSuccess(ports));
  }

  @ApiOperation({
    summary: 'Should update Port by id (admin)',
    description: 'Update Port',
  })
  @ApiCreatedResponse({
    description: 'Ok',
    content: {
      'application/json': {
        example: SwaggerResponseBuilder.sendSuccess([PortObject]),
      },
    },
  })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':portId')
  public async updatePort(
    @Req() req: Request,
    @Res() res: Response,
    @Param('portId') portId: string,
    @Body() updatePortDto: UpdatePortDto,
  ): Promise<Response> {
    const port = await this.portsService.findById(portId);
    if (!port) throw new ProjectError(1014);

    await this.portsService.update(portId, updatePortDto);

    return res.sendStatus(HttpStatus.OK);
  }
}
