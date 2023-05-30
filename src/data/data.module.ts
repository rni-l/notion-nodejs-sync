import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { HttpModule } from '@nestjs/axios';
import { Data } from './data.entity';
import { DataConfig } from './data-config.entity';
@Module({
  imports: [SequelizeModule.forFeature([Data, DataConfig]), HttpModule],
  controllers: [DataController],
  providers: [DataService],
})
export class DataModule {}
