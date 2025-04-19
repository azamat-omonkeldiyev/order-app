import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailService } from './mail/mail.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterController } from './multer/multer.controller';
import { OrderModule } from './order/order.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [UserModule,MongooseModule.forRoot('mongodb://localhost/nest-order'),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/file',
    }),
    OrderModule,
    ProductsModule,
  ],
  controllers: [AppController,MulterController],
  providers: [AppService,MailService,
    
  ],
  
})
export class AppModule {}
