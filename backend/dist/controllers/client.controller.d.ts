import { Client, Order } from '../models';
import { ClientRepository, OrderRepository } from '../repositories';
import { Credentials } from '../types';
import { ClientUserService } from '../services/client-user.service';
export declare class ClientController {
    clientRepository: ClientRepository;
    orderRepository: OrderRepository;
    clientUserService: ClientUserService;
    constructor(clientRepository: ClientRepository, orderRepository: OrderRepository, clientUserService: ClientUserService);
    register(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<{
        client: Client;
    }>;
    login(credentials: Credentials): Promise<{
        token: string;
        client: Client;
    }>;
    placeOrder(clientId: string, orderData: Omit<Order, 'id' | 'clientId'>): Promise<Order>;
}
