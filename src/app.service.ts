import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    return 'Hello World!';
  }
}
