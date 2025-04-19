import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.entity';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [ MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),UserModule,MailModule],
  controllers: [OrderController,],
  providers: [OrderService],
})
export class OrderModule {}
