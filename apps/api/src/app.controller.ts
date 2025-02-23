import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('menus')
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly appService: AppService) {}

  @Get()
  getMenus() {
    return this.appService.getMenus();
  }

  @Get(':id')
  getMenuById(@Param('id') id: string, @Query('depth') depth?: string) {
    return this.appService.getMenuById(id, depth ? parseInt(depth) : 1);
  }

  @Post()
  createMenuItem(
    @Body() data: { name: string; parentId?: string; order?: number },
  ) {
    return this.appService.createMenuItem(data);
  }

  @Put(':id')
  updateMenuItem(
    @Param('id') id: string,
    @Body() data: { name?: string; order?: number; parentId?: string },
  ) {
    return this.appService.updateMenuItem(id, data);
  }

  @Delete(':id')
  deleteMenuItem(@Param('id') id: string) {
    return this.appService.deleteMenuItem(id);
  }
}
