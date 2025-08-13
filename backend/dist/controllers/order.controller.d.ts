import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { UserProfile } from '@loopback/security';
import { Order, OrderStatus } from '../models';
import { OrderRepository, ProductRepository } from '../repositories';
export declare class OrderController {
    orderRepository: OrderRepository;
    productRepository: ProductRepository;
    constructor(orderRepository: OrderRepository, productRepository: ProductRepository);
    create(order: Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Order>;
    count(where?: Where<Order>): Promise<Count>;
    find(filter?: Filter<Order>): Promise<Order[]>;
    getMyOrders(currentUser: UserProfile, filter?: Filter<Order>): Promise<Order[]>;
    getAnalytics(currentUser: UserProfile): Promise<any>;
    findById(id: number, filter?: FilterExcludingWhere<Order>): Promise<Order>;
    updateStatus(id: number, statusUpdate: {
        status: OrderStatus;
    }, currentUser: UserProfile): Promise<void>;
    updateById(id: number, order: Partial<Order>, currentUser: UserProfile): Promise<void>;
    deleteById(id: number, currentUser: UserProfile): Promise<void>;
}
