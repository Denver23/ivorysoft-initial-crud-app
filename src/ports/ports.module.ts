import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponseBuilderModule } from '../responseBuilder/responseBuilder.module';
import { Port, PortSchema } from './ports.model';
import { PortsController } from './ports.controller';
import { PortsService } from './ports.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Port.name, schema: PortSchema }]), ResponseBuilderModule],
  controllers: [PortsController],
  providers: [PortsService],
})
export class PortsModule {}
