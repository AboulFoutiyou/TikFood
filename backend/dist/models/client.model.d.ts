import { Order } from './order.model';
import { User } from '@loopback/authentication-jwt';
export declare class Client extends User {
    name: string;
    password: string;
    description?: string;
    location?: string;
    phone?: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    orders: Order[];
    constructor(data?: Partial<Client>);
}
export interface ClientRelations {
    orders?: Order[];
}
export type ClientWithRelations = Client & ClientRelations;
