import { VesselDocument } from './vessels.model';
import { VesselObject } from '../config/swagger-examples';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { VesselsService } from './vessels.service';
import { ResponseBuilderService, SwaggerResponseBuilder } from '../responseBuilder/responseBuilder.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../roles-guard/role.enum';
import { ProjectError } from '../filters/all-exceptions.filter';
import { Request, Response } from 'express';
import { CreateVesselDto } from './dto/create-vessel.dto';
import { UpdateVesselDto } from './dto/update-vessel.dto';
import { RolesGuard } from '../roles-guard/roles.guard';
import { Roles } from '../roles-guard/roles.decorator';

@ApiTags('Vessels')
@Controller('vessels')
export class VesselsController {
  constructor(
    private readonly vesselsService: VesselsService,
    private readonly responseBuilderService: ResponseBuilderService,
  ) {}

  @ApiOperation({
    summary: 'Should create new Vessel',
    description: 'Returns new Vessel Object',
  })
  @ApiCreatedResponse({
    description: 'Created',
    content: {
      'application/json': {
        example: SwaggerResponseBuilder.sendSuccess(VesselObject),
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Req() req: Request, @Res() res: Response, @Body() createVesselDto: CreateVesselDto) {
    const vessel = await this.vesselsService.create(createVesselDto);

    return res.status(HttpStatus.CREATED).json(this.responseBuilderService.sendSuccess(vessel));
  }

  @ApiOperation({
    summary: 'Should delete Vessel by id',
    description: 'Delete Vessel',
  })
  @ApiCreatedResponse({
    description: 'No Content',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':vesselId')
  public async delete(
    @Req() req: Request,
    @Res() res: Response,
    @Param('vesselId') vesselId: string,
  ): Promise<Response> {
    const { user }: any = req;

    if (user.role !== Role.Admin) throw new ProjectError(1002);

    const vessel: VesselDocument | null = await this.vesselsService.findById(vesselId);

    if (!vessel) throw new ProjectError(1014);

    await this.vesselsService.delete(vesselId);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @ApiOperation({
    summary: 'Should fetch Vessel by id',
    description: 'Get Vessel',
  })
  @ApiCreatedResponse({
    description: 'Ok',
    content: {
      'application/json': {
        example: SwaggerResponseBuilder.sendSuccess(VesselObject),
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':vesselId')
  public async getPort(
    @Req() req: Request,
    @Res() res: Response,
    @Param('vesselId') vesselId: string,
  ): Promise<Response> {
    const vessel: VesselDocument | null = await this.vesselsService.findById(vesselId);

    if (!vessel) throw new ProjectError(1015);

    return res.status(HttpStatus.OK).json(this.responseBuilderService.sendSuccess(vessel));
  }

  @ApiOperation({
    summary: 'Should fetch all Vessels',
    description: 'Get Vessels',
  })
  @ApiCreatedResponse({
    description: 'Ok',
    content: {
      'application/json': {
        example: SwaggerResponseBuilder.sendSuccess([VesselObject]),
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('')
  public async getAllPorts(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const vessels: VesselDocument[] = await this.vesselsService.findAll();

    return res.status(HttpStatus.OK).json(this.responseBuilderService.sendSuccess(vessels));
  }

  @ApiOperation({
    summary: 'Should update Vessel by id',
    description: 'Update Vessel',
  })
  @ApiCreatedResponse({
    description: 'Ok',
  })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':vesselId')
  public async updatePort(
    @Req() req: Request,
    @Res() res: Response,
    @Param('vesselId') vesselId: string,
    @Body() updateVesselDto: UpdateVesselDto,
  ): Promise<Response> {
    const vessel: any = await this.vesselsService.update(vesselId, updateVesselDto);
    if (vessel.modifiedCount === 0) throw new ProjectError(1015);

    return res.sendStatus(HttpStatus.OK);
  }
}
