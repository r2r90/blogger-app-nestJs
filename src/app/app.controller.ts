import { Controller, Delete, Get, HttpCode, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getSwagger(@Res() res: Response): void {
    return res.redirect('/swagger');
  }

  @Delete('testing/all-data')
  @HttpCode(204)
  testing() {
    return this.appService.deleteAllData();
  }
}
