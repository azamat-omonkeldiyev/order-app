import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './entities/order.entity';
import { Model } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private Order: Model<Order>,
    @InjectModel(User.name) private User: Model<User>,
    private mail: MailService,
  ) {}
  async create(data: CreateOrderDto, id: string) {
    try {
      let user = await this.User.findById(id);
      if(!user){
        throw new BadRequestException("user not found")
      }
      let newOrder = await this.Order.create(data);
      await this.mail.sendEmail(user.email,"New Order",`<h4>You have new order id = ${newOrder.id}</h4>`)
      return newOrder;
    } catch (error) {
      return error;
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    sortBy: string = 'name',
    order: 'asc' | 'desc' = 'asc',
    userId?: string,
    productId?: string,
  ) {
    try {
      const filter: any = {};

      if (userId) filter.user = userId;

      if (productId) filter.products = productId;

      const sortOrder = order === 'asc' ? 1 : order === 'desc' ? -1 : 1;
      const Orders = await this.Order.find(filter)
        .populate([{ path: 'user' }])
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(Number(limit));

      return {
        data: Orders,
      };
    } catch (error) {
      return error;
    }
  }

  async findOne(id: string) {
    try {
      let Order = await this.Order.findById(id).populate('user').exec();
      if (!Order) {
        return { message: 'Order not found' };
      }
      return Order;
    } catch (error) {
      return error;
    }
  }

  async update(id: string, data: UpdateOrderDto) {
    try {
      let updateOrder = await this.Order.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!updateOrder) {
        return { message: 'Order not found' };
      }
      return updateOrder;
    } catch (error) {
      return error;
    }
  }

  async remove(id: string) {
    try {
      console.log(id);
      let deleteteOrder = await this.Order.findByIdAndDelete(id);
      if (!deleteteOrder) {
        return { message: 'Order not found' };
      }
      return deleteteOrder;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
