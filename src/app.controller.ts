import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import fastify from 'fastify';
import http from 'http';

@Controller('v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post(['upload', 's3'])
  async uploadS3Controller(
    @Req() req,
    @Res() res: fastify.FastifyReply<http.ServerResponse>,
  ): Promise<fastify.FastifyReply<http.ServerResponse>> {
    try {
      const dataUpload = await this.appService.fileUploadS3(req.body.file);

      return res.status(HttpStatus.OK).send(dataUpload);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
