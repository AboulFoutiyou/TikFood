import { Product } from './product.model';
import { Order } from './order.model';
import { User } from '@loopback/authentication-jwt';
export declare class Vendor extends User {
    name: string;
    password: string;
    description?: string;
    location?: string;
    phone?: string;
    isAvailable?: boolean;
    openingHours?: {
        start: string;
        end: string;
    };
    avatar?: string;
    createdAt?: Date;
    updatedAt?: Date;
    products: Product[];
    orders: Order[];
    constructor(data?: Partial<Vendor>);
}
export interface VendorRelations {
    products?: Product[];
    orders?: Order[];
}
export type VendorWithRelations = Vendor & VendorRelations;
