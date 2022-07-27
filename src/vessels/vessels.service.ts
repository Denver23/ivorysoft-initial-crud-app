import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vessel, VesselDocument } from './vessels.model';

@Injectable()
export class VesselsService {
  constructor(
    @InjectModel(Vessel.name) private vesselModel: Model<VesselDocument>,
  ) {}

  public async create(vesselData: any): Promise<VesselDocument> {
    return this.vesselModel.create(vesselData);
  }

  public async findById(_id: string): Promise<VesselDocument> {
    return this.vesselModel.findById(_id);
  }

  public async findAll(filter = {}): Promise<VesselDocument[]> {
    return this.vesselModel.find(filter);
  }

  public async update(_id: string, payload: any) {
    return this.vesselModel.updateOne({ _id }, payload);
  }

  public async delete(_id: string) {
    return this.vesselModel.deleteOne({ _id });
  }
}
