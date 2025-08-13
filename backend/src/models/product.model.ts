import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Vendor} from './vendor.model';
import {Order} from './order.model';

export enum ProductCategory {
  SUCRE = 'sucré',
  SALE = 'salé',
  MIXTE = 'mixte',
  JUS = 'jus',
}

@model()
export class Product extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(ProductCategory),
    },
  })
  category: ProductCategory;

  @property({
    type: 'array',
    itemType: 'string',
  })
  images?: string[];

  @property({
    type: 'boolean',
    default: true,
  })
  isAvailable?: boolean;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt?: Date;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  updatedAt?: Date;

  @belongsTo(() => Vendor)
  vendorId: number;

  @hasMany(() => Order)
  orders: Order[];

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  vendor?: Vendor;
  orders?: Order[];
}

export type ProductWithRelations = Product & ProductRelations;