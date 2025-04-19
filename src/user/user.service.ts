import { BadRequestException, Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt"
import { LoginUserDto } from './dto/login-user.dto';
import { MailService } from 'src/mail/mail.service';
import { verifyOtpDto } from './dto/verify-otp.dto';
import * as UAParser from 'ua-parser-js';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private User: Model<User>,
    private readonly jwt: JwtService,
    private mail: MailService,
  ) {}

  async findUser(name: string) {
    try {
      let user = await this.User.findOne({ username:name });
      return user;
    } catch (error) {
      return error;
    }
  }

  async findEmail(email: string) {
    try {
      let user = await this.User.findOne({ email });
      return user;
    } catch (error) {
      return error;
    }
  }

  async register(data: CreateUserDto) {
    let user = await this.findUser(data.username);
    if (user) {
      throw new BadRequestException('username exists');
    }
    
    let email = await this.findEmail(data.email);
    if (email) {
      throw new BadRequestException('email exists');
    }
    
    let hash = bcrypt.hashSync(data.password, 10);

    try {
      let newUser = await this.User.create({
        ...data,
        password: hash,
      });
      // console.log("salom")
      let otp = this.mail.createOtp(data.email);
      // console.log(otp)
      await this.mail.sendEmail(data.email,"ONE-TIME PASSWORD", `<h4>Your login password is <h3><u>${otp}</u></h3> The validity period is 2 minutes.</h4>`)
      return newUser;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  
  verify(data:verifyOtpDto){
    let match = this.mail.checkOtp(data.otp,data.email);
    return {result: match};
  }

  async login(data: LoginUserDto,request: Request) {
    try {
      let user = await this.findEmail(data.email);
      if (!user) {
        throw new BadRequestException('email not exists');
      }

      let match = bcrypt.compareSync(data.password, user.password);
      if (!match) {
        throw new UnauthorizedException('wrong password');
      }
      console.log(user.id);
      const userAgent = request.headers['user-agent'];
      await this.mail.sendEmail(data.email,"Login With Your Email", `<h4>${userAgent}</h4>`)
      let token = this.jwt.sign({ id: user.id, role: user.role });
      console.log(token);
      return { token };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async me(id: string) {
    try {
      let user = await this.User.findById(id);
      return user;
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error);
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    sortBy: string = 'name',
    order: 'asc' | 'desc' = 'asc',
    name?: string
  ) {
    try {
      const filter: any = {};

      if (name) filter.name = { $regex: name, $options: 'i' };
      const sortOrder = order === 'asc' ? 1 : order === 'desc' ? -1 : 1;
      const users = await this.User.find(filter)
        // .populate('actors')
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(Number(limit));

      return {
        data: users,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async findOne(id: string) {
    try {
      let user = await this.User.findById(id);
      if(!user){
        throw new BadRequestException('user not found');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: string, data: UpdateUserDto) {
    try {
      let user = await this.User.findByIdAndUpdate(id,data);
      if(!user){
        throw new BadRequestException('user not found');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: string) {
    try {
      let user = await this.User.findByIdAndDelete(id);
      if(!user){
        throw new BadRequestException('user not found');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
