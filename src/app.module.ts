import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConvertModule } from './convert/convert.module';

import { ConvertService } from './convert/convert.service';

@Module({
  imports: [ConvertModule],
  controllers: [AppController],
  providers: [AppService, ConvertService],
})
export class AppModule {}
