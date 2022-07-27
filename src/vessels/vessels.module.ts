import { Module } from '@nestjs/common';
import { ResponseBuilderModule } from '../responseBuilder/responseBuilder.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Vessel, VesselSchema } from './vessels.model';
import { VesselsController } from './vessels.controller';
import { VesselsService } from './vessels.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vessel.name, schema: VesselSchema }]),
    ResponseBuilderModule,
  ],
  controllers: [VesselsController],
  providers: [VesselsService],
})
export class VesselsModule {}
