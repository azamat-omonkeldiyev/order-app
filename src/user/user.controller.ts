import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from './decorators/role.decorator';
import { Role } from './enam/role.enum';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { pseudoRandomBytes } from 'crypto';
import { verifyOtpDto } from './dto/verify-otp.dto';
import { ApiQuery } from '@nestjs/swagger';

enum sortEnum {
  id = 'id',
  name = 'name',
  email = 'email'
}
enum orderEnum {
  asc = 'asc',
  desc = 'desc',
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() data: CreateUserDto) {
    return this.userService.register(data);
  }

  @Post('verify')
  verify(@Body() data: verifyOtpDto){
    return this.userService.verify(data);
  }

  @Post('login')
  login(@Body() data: LoginUserDto) {
    return this.userService.login(data);
  }


  @Roles(Role.ADMIN, Role.USER, Role.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get('/me')
  me(@Req() req) {
    const userId = req['user-id'];
    console.log(req['user-role'])
    console.log('salom')
    return this.userService.me(userId);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({
    example: 1,
    name: 'page',
  })
  @ApiQuery({
    example: 10,
    name: 'limit',
  })
  @ApiQuery({
    name: 'sortBy',
    enum: sortEnum,
  })
  @ApiQuery({
    name: 'order',
    enum: orderEnum,
  })
  @ApiQuery({
    name: 'name',
    required: false,
  })
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: sortEnum,
    @Query('order') order: orderEnum,
    @Query('name') name: string
  ) {
    return this.userService.findAll(page,limit,sortBy,order,name);
  }

  @Roles(Role.ADMIN, Role.USER, Role.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.USER, Role.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
