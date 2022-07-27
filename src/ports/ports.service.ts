import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Port, PortDocument } from './ports.model';

@Injectable()
export class PortsService {
  constructor(@InjectModel(Port.name) private portModel: Model<PortDocument>) {}

  public async create(portData: any): Promise<PortDocument> {
    return this.portModel.create(portData);
  }

  public async findById(_id: string): Promise<PortDocument> {
    return this.portModel.findById(_id);
  }

  public async findAll(filter = {}): Promise<PortDocument[]> {
    return this.portModel.find(filter);
  }

  public async update(_id: string, payload: any) {
    return this.portModel.updateOne({ _id }, payload);
  }

  public async delete(_id: string) {
    return this.portModel.deleteOne({ _id });
  }
}
