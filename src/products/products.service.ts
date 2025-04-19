import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private Product: Model<Product>) {}
  async create(data: CreateProductDto) {
    try {
      let newProduct = await this.Product.create(data);
      return newProduct;
    } catch (error) {
      return error;
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    sortBy: string = 'name',
    order: 'asc' | 'desc' = 'asc',
    name?: string,
  ) {
    try {
      const filter: any = {};

      if (name) filter.name = { $regex: name, $options: 'i' };

      const sortOrder = order === 'asc' ? 1 : order === 'desc' ? -1 : 1;
      const Products = await this.Product.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(Number(limit));

      return {
        data: Products,
      };
    } catch (error) {
      return error;
    }
  }

  async findOne(id: string) {
    try {
      let Product = await this.Product.findById(id);
      if (!Product) {
        return { message: 'Product not found' };
      }
      return Product;
    } catch (error) {
      return error;
    }
  }

  async update(id: string, data: UpdateProductDto) {
    try {
      let updateProduct = await this.Product.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!updateProduct) {
        return { message: 'Product not found' };
      }
      return updateProduct;
    } catch (error) {
      return error;
    }
  }

  async remove(id: string) {
    try {
      console.log(id);
      let deleteteProduct = await this.Product.findByIdAndDelete(id);
      if (!deleteteProduct) {
        return { message: 'Product not found' };
      }
      return deleteteProduct;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
