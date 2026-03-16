import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Typescript!, Hello NestJs!\n this is Emman ';
  }
}
