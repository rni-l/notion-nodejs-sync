import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get()
  syncLatest() {
    return this.dataService.syncLatest();
  }
  @Get()
  syncAll() {
    return this.dataService.syncAll();
  }
  @Get('/all')
  getAll() {
    return this.dataService.getAll();
  }
}
