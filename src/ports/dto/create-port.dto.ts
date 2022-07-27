import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePortDto {
  @ApiProperty({ default: 'Odesskiy' })
  @IsString()
  name: string;

  @ApiProperty({ default: 'Odessa' })
  @IsString()
  location: string;
}
